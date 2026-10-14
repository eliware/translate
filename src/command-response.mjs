import { locales } from "./locales.mjs";

const supportedLocales = new Set([...locales, "en-US"]);

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasTextLength(value, maximum) {
  return typeof value === "string" && value.length > 0 && value.length <= maximum;
}

function hasLocalizationLengths(value, maximum) {
  return (
    value === undefined ||
    (isRecord(value) &&
      Object.entries(value).every(
        ([locale, text]) => supportedLocales.has(locale) && hasTextLength(text, maximum),
      ))
  );
}

function hasValidCommandLengths(command, isOption = false) {
  if (!isRecord(command) || !hasTextLength(command.name, 32)) return false;
  if (!hasLocalizationLengths(command.name_localizations, 32)) return false;
  if (Object.hasOwn(command, "description") && !hasTextLength(command.description, 100))
    return false;
  if (!hasLocalizationLengths(command.description_localizations, 100)) return false;
  if (
    !isOption &&
    command.type > 1 &&
    (Object.hasOwn(command, "description") ||
      Object.hasOwn(command, "description_localizations") ||
      Object.hasOwn(command, "options"))
  ) {
    return false;
  }
  return (
    command.options === undefined ||
    (Array.isArray(command.options) &&
      command.options.every((option) => hasValidCommandLengths(option, true)))
  );
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
  const translated = JSON.parse(result);
  if (!isRecord(translated) || !isRecord(source))
    throw new TypeError("Command response must be an object");
  const output = mergeCommand(source, translated);
  if (!hasValidCommandLengths(output)) {
    throw new TypeError("Command response violates name or description length limits");
  }
  return JSON.stringify(output, null, 2);
}
