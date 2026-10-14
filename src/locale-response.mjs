function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasSameShape(source, translated) {
  if (Array.isArray(source)) {
    return (
      Array.isArray(translated) &&
      source.length === translated.length &&
      source.every((value, index) => hasSameShape(value, translated[index]))
    );
  }
  if (isRecord(source)) {
    return (
      isRecord(translated) &&
      Object.keys(source).length === Object.keys(translated).length &&
      Object.keys(source).every(
        (key) => Object.hasOwn(translated, key) && hasSameShape(source[key], translated[key]),
      )
    );
  }
  if (typeof source === "string") return typeof translated === "string";
  return Object.is(source, translated);
}

export function isLocaleResponse(source, response) {
  if (!isRecord(source)) return false;
  try {
    const translated = JSON.parse(response);
    return isRecord(translated) && hasSameShape(source, translated);
  } catch {
    return false;
  }
}
