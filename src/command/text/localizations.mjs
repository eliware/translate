import { locales } from "../../locales.mjs";
import { isRecord } from "../record.mjs";
import { collectTextIssues } from "./values.mjs";

const supportedLocales = new Set([...locales, "en-US"]);

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
