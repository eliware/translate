import { injectLocaleJson } from "./prompts/locale-prompt.mjs";
import { setTargetLocale } from "./prompt.mjs";

export async function runLocaleMode({
  fsDep,
  pathDep,
  processDep,
  cwd,
  moduleDir,
  apiKey,
  locales,
  translateLocaleDep,
  createProgressBarDep,
  writeError,
}) {
  const sourcePath = pathDep.join(cwd, "en-US.json");
  let source, prompt;
  try {
    source = await fsDep.readFile(sourcePath, "utf8");
  } catch {
    writeError("Failed to read en-US.json\n");
    return 1;
  }
  try {
    prompt = JSON.parse(await fsDep.readFile(pathDep.join(moduleDir, "..", "prompt.json"), "utf8"));
  } catch (error) {
    writeError(
      error instanceof SyntaxError
        ? "Failed to parse prompt.json\n"
        : "Failed to read prompt.json\n",
    );
    return 1;
  }
  if (!injectLocaleJson(prompt, source)) {
    writeError("Invalid prompt.json structure\n");
    return 1;
  }
  const progress = createProgressBarDep(locales.length, processDep.stdout);
  let failed = false;
  await Promise.all(
    locales.map(async (locale) => {
      if (locale === "en-US") {
        try {
          await fsDep.writeFile(sourcePath, source);
        } catch {}
        progress.update(locale);
        return;
      }
      try {
        const localePrompt = setTargetLocale(JSON.parse(JSON.stringify(prompt)), locale);
        const result = await translateLocaleDep({ locale, promptObj: localePrompt, apiKey });
        await fsDep.writeFile(pathDep.join(cwd, `${locale}.json`), result);
      } catch {
        failed = true;
        writeError(`Failed to translate ${locale}\n`);
      }
      progress.update(locale);
    }),
  );
  return failed ? 1 : 0;
}
