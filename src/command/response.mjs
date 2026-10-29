import { locales } from "../locales.mjs";

const supportedLocales = new Set([...locales, "en-US"]);

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectTextIssues(value, path, maximum, issues) {
  if (typeof value !== "string") {
    issues.push(`${path} must be text.`);
    return;
  }
  if (value.length === 0) {
    issues.push(`${path} must not be empty.`);
    return;
  }
  if (value.length > maximum) issues.push(`${path} must have no more than ${maximum} characters.`);
}

function collectLocalizationIssues(value, path, maximum, issues) {
  if (value === undefined) return;
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }
  for (const [locale, text] of Object.entries(value)) {
    const localePath = `${path}.${locale}`;
    if (!supportedLocales.has(locale)) issues.push(`${localePath} uses an unsupported locale.`);
    collectTextIssues(text, localePath, maximum, issues);
  }
}

function collectCommandIssues(command, path, isOption, issues) {
  if (!isRecord(command)) {
    issues.push(`${path} must be an object.`);
    return;
  }
  collectTextIssues(command.name, `${path}.name`, 32, issues);
  collectLocalizationIssues(command.name_localizations, `${path}.name_localizations`, 32, issues);
  if (Object.hasOwn(command, "description")) {
    collectTextIssues(command.description, `${path}.description`, 100, issues);
  }
  collectLocalizationIssues(
    command.description_localizations,
    `${path}.description_localizations`,
    100,
    issues,
  );
  if (
    !isOption &&
    command.type > 1 &&
    (Object.hasOwn(command, "description") ||
      Object.hasOwn(command, "description_localizations") ||
      Object.hasOwn(command, "options"))
  ) {
    issues.push(`${path} is a context command and cannot have descriptions or options.`);
  }
  if (command.options !== undefined && !Array.isArray(command.options)) {
    issues.push(`${path}.options must be an array.`);
    return;
  }
  if (Array.isArray(command.options)) {
    command.options.forEach((option, index) =>
      collectCommandIssues(option, `${path}.options[${index}]`, true, issues),
    );
  }
}

function mergeLocalizations(source, translated) {
  const localizations = isRecord(source) ? source : {};
  const updates = Object.fromEntries(
    Object.entries(translated).filter(([, value]) => typeof value === "string"),
  );
  return Object.fromEntries(
    Object.entries({ ...localizations, ...updates }).filter(
      ([, value]) => typeof value === "string",
    ),
  );
}

function mergeCommand(source, translated) {
  if (!isRecord(source)) return source;
  const output = { ...source };
  for (const key of ["name", "description"]) {
    if (Object.hasOwn(source, key) && typeof translated[key] === "string") {
      output[key] = translated[key];
    }
  }
  for (const key of ["name_localizations", "description_localizations"]) {
    if (isRecord(translated[key]) && !(key === "description_localizations" && source.type > 1)) {
      output[key] = mergeLocalizations(source[key], translated[key]);
    }
  }
  if (Array.isArray(source.options)) {
    output.options = source.options.map((option, index) => {
      const translatedOption = Array.isArray(translated.options) ? translated.options[index] : null;
      return mergeCommand(option, isRecord(translatedOption) ? translatedOption : {});
    });
  }
  return output;
}

export function formatCommandResponse(result, source) {
  let translated;
  try {
    translated = JSON.parse(result);
  } catch {
    throw new TypeError("Model response is not valid JSON.");
  }
  if (!isRecord(translated) || !isRecord(source))
    throw new TypeError("Command response must be an object");
  const output = mergeCommand(source, translated);
  const issues = [];
  collectCommandIssues(output, "command", false, issues);
  if (issues.length > 0) {
    throw new TypeError(`Command response failed validation: ${issues.join(" ")}`);
  }
  return JSON.stringify(output, null, 2);
}
