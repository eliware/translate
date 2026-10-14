import path from "node:path";
import fs from "node:fs/promises";
import { config as dotenvConfig } from "dotenv";
import { getCurrentDirname, log } from "@eliware/common";
import { translateLocale } from "./worker.mjs";
import { createProgressBar } from "./progress.mjs";
import { locales as supportedLocales } from "./locales.mjs";
import { runLocaleMode } from "./locale-mode.mjs";
import { runCommandMode } from "./command-mode.mjs";

export async function runTranslate({
  fsDep = fs,
  pathDep = path,
  processDep = process,
  dotenvConfigDep = dotenvConfig,
  translateLocaleDep = translateLocale,
  createProgressBarDep = createProgressBar,
  logDep = log,
  moduleDirDep,
  importMeta = import.meta,
  locales = supportedLocales,
} = {}) {
  const writeError = (message) => logDep.error(message.trim());
  const moduleDir = moduleDirDep || getCurrentDirname(importMeta, pathDep.dirname);
  const dotenvPath = pathDep.join(moduleDir, "..", ".env");
  try {
    await fsDep.access(dotenvPath);
  } catch {
    writeError(".env file not found\n");
    return 1;
  }
  dotenvConfigDep({ path: dotenvPath, quiet: true });
  const apiKey = processDep.env.OPENAI_API_KEY;
  if (!apiKey) {
    writeError("Missing OPENAI_API_KEY\n");
    return 1;
  }
  const cwd = processDep.cwd();
  const sourcePath = pathDep.join(cwd, "en-US.json");
  try {
    await fsDep.access(sourcePath);
  } catch {
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
