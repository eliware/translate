import { locales } from "../locales.mjs";

const supportedLocales = new Set([...locales, "en-US"]);

export function isRecord(value) {
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

export function validateCommand(command) {
  const issues = [];
  collectCommandIssues(command, "command", false, issues);
  return issues;
}
