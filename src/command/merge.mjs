import { isRecord } from "./text-validation.mjs";

export function mergeLocalizations(source, translated) {
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

export function mergeCommandFields(source, translated) {
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
  return output;
}
