import { locales } from "../../locales.mjs";
import { isRecord } from "../record.mjs";
import { collectCommandNameIssues, collectTextIssues } from "./values.mjs";

const supportedLocales = new Set([...locales, "en-US"]);

export function collectLocalizationIssues(value, path, maximum, issues, isCommandName = false) {
  if (value === undefined) return;
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }
  for (const [locale, text] of Object.entries(value)) {
    const localePath = `${path}.${locale}`;
    if (!supportedLocales.has(locale)) issues.push(`${localePath} uses an unsupported locale.`);
    if (isCommandName) collectCommandNameIssues(text, localePath, issues);
    else collectTextIssues(text, localePath, maximum, issues);
  }
}
