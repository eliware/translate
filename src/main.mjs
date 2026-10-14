import path from "node:path";
import fs from "node:fs/promises";
import { log } from "@eliware/common";
import { loadRuntimeConfig } from "./config.mjs";
import { translateLocale } from "./worker.mjs";
import { createProgressBar } from "./progress.mjs";
import { locales as supportedLocales } from "./locales.mjs";
import { runLocaleMode } from "./locale-mode.mjs";
import { runCommandMode } from "./command-mode.mjs";
import { createErrorWriter } from "./cli-error.mjs";
import { selectTranslationMode } from "./mode-selector.mjs";

export async function runTranslate({
  fsDep = fs,
  pathDep = path,
  processDep = process,
  dotenvConfigDep,
  translateLocaleDep = translateLocale,
  createProgressBarDep = createProgressBar,
  logDep = log,
  moduleDirDep,
  importMeta = import.meta,
  locales = supportedLocales,
} = {}) {
  const writeError = createErrorWriter(logDep);
  const config = await loadRuntimeConfig({
    fsDep,
    pathDep,
    processDep,
    dotenvConfigDep,
    moduleDirDep,
    importMeta,
    writeError,
  });
  if (config.error) {
    return 1;
  }
  const { moduleDir, apiKey } = config;
  const cwd = processDep.cwd();
  const mode = await selectTranslationMode({ fsDep, pathDep, cwd });
  if (mode === "command") {
    return runCommandMode({
      fsDep,
      pathDep,
      cwd,
      moduleDir,
      apiKey,
      translateLocaleDep,
      writeError,
    });
  }
  return runLocaleMode({
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
  });
}
