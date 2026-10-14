function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
  return JSON.stringify(mergeCommand(source, translated), null, 2);
}
