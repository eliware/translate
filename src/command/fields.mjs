import { isRecord } from "./record.mjs";
import { mergeLocalizations } from "./localizations.mjs";

export function mergeCommandFields(source, translated, allowDescriptionLocalizations = true) {
  if (!isRecord(source)) return source;
  const output = { ...source };
  for (const key of ["name", "description"]) {
    if (Object.hasOwn(source, key) && typeof translated[key] === "string") {
      output[key] = translated[key];
    }
  }
  for (const key of ["name_localizations", "description_localizations"]) {
    if (
      isRecord(translated[key]) &&
      (key !== "description_localizations" || allowDescriptionLocalizations)
    ) {
      output[key] = mergeLocalizations(source[key], translated[key]);
    }
  }
  return output;
}
