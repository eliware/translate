import { injectLocaleJson } from "../prompts/locale-prompt.mjs";
import { setTargetLocale } from "../prompts/target-locale.mjs";
import pLimit from "../p-limit.mjs";
import { isLocaleResponse } from "./response.mjs";
import { writeDebugError } from "../cli-error.mjs";

const MAX_CONCURRENT_TRANSLATIONS = 5;

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
  dryRun = false,
  writeInfo = () => {},
  debug = false,
  writeDebug = () => {},
}) {
  const sourcePath = pathDep.join(cwd, "en-US.json");
  let source, sourceData, prompt;
  try {
    source = await fsDep.readFile(sourcePath, "utf8");
  } catch (error) {
    writeError("Failed to read en-US.json\n");
    writeDebugError({ debug, writeDebug, context: "en-US.json", error });
    return 1;
  }
  try {
    sourceData = JSON.parse(source);
  } catch {
    writeError("Failed to parse en-US.json\n");
    writeDebugError({
      debug,
      writeDebug,
      context: "en-US.json",
      error: new Error("File is not valid JSON"),
    });
    return 1;
  }
  if (dryRun) {
    for (const locale of locales) {
      if (locale !== "en-US") writeInfo(`Target file: ${locale}.json\n`);
    }
    return 0;
  }
  try {
    prompt = JSON.parse(await fsDep.readFile(pathDep.join(moduleDir, "..", "prompt.json"), "utf8"));
  } catch (error) {
    writeError(
      error instanceof SyntaxError
        ? "Failed to parse prompt.json\n"
        : "Failed to read prompt.json\n",
    );
    writeDebugError({ debug, writeDebug, context: "prompt.json", error });
    return 1;
  }
  if (!injectLocaleJson(prompt, source)) {
    writeError("Invalid prompt.json structure\n");
    writeDebugError({
      debug,
      writeDebug,
      context: "prompt.json",
      error: new Error("Prompt has no usable text part"),
    });
    return 1;
  }
  const progress = createProgressBarDep(locales.length, processDep.stdout);
  let failed = false;
  const limit = pLimit(MAX_CONCURRENT_TRANSLATIONS);
  await Promise.all(
    locales.map((locale) =>
      limit(async () => {
        if (locale === "en-US") {
          try {
            await fsDep.writeFile(sourcePath, source);
          } catch (error) {
            failed = true;
            writeError("Failed to write en-US.json\n");
            writeDebugError({ debug, writeDebug, context: "en-US.json", error });
          }
          progress.update(locale);
          return;
        }
        try {
          const localePrompt = setTargetLocale(JSON.parse(JSON.stringify(prompt)), locale);
          const result = await translateLocaleDep({ locale, promptObj: localePrompt, apiKey });
          if (!isLocaleResponse(sourceData, result)) {
            failed = true;
            writeError(`Invalid locale JSON response for ${locale}\n`);
            writeDebugError({
              debug,
              writeDebug,
              context: `${locale}.json`,
              error: new Error("Response does not match the source JSON structure"),
            });
            progress.update(locale);
            return;
          }
          await fsDep.writeFile(pathDep.join(cwd, `${locale}.json`), result);
        } catch (error) {
          failed = true;
          writeError(`Failed to translate ${locale}\n`);
          writeDebugError({ debug, writeDebug, context: `${locale}.json`, error });
        }
        progress.update(locale);
      }),
    ),
  );
  return failed ? 1 : 0;
}
