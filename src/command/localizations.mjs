import { isRecord } from "./record.mjs";

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
