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
