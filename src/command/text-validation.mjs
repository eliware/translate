import { locales } from "../locales.mjs";

const supportedLocales = new Set([...locales, "en-US"]);

export function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function collectTextIssues(value, path, maximum, issues) {
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

export function collectLocalizationIssues(value, path, maximum, issues) {
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

function collectCommandTextIssues(command, path, issues) {
  if (!isRecord(command)) return;
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
  if (Array.isArray(command.options)) {
    command.options.forEach((option, index) =>
      collectCommandTextIssues(option, `${path}.options[${index}]`, issues),
    );
  }
}

export function validateCommandText(command) {
  const issues = [];
  collectCommandTextIssues(command, "command", issues);
  return issues;
}
