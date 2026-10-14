export async function selectTranslationMode({ fsDep, pathDep, cwd }) {
  try {
    await fsDep.access(pathDep.join(cwd, "en-US.json"));
    return "locale";
  } catch {
    return "command";
  }
}
