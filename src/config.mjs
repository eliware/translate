import path from "node:path";
import fs from "node:fs/promises";
import { config as dotenvConfig } from "dotenv";
import { getCurrentDirname } from "@eliware/common";

export async function loadRuntimeConfig({
  fsDep = fs,
  pathDep = path,
  processDep = process,
  dotenvConfigDep = dotenvConfig,
  moduleDirDep,
  importMeta = import.meta,
  writeError = () => {},
  dryRun = false,
} = {}) {
  const moduleDir = moduleDirDep || getCurrentDirname(importMeta, pathDep.dirname);
  if (dryRun) return { moduleDir };
  const dotenvPath = pathDep.join(moduleDir, "..", ".env");
  try {
    await fsDep.access(dotenvPath);
  } catch {
    writeError(".env file not found");
    return { error: ".env file not found" };
  }
  dotenvConfigDep({ path: dotenvPath, quiet: true });
  const apiKey = processDep.env.OPENAI_API_KEY;
  if (!apiKey) {
    writeError("Missing OPENAI_API_KEY");
    return { error: "Missing OPENAI_API_KEY" };
  }
  return { moduleDir, dotenvPath, apiKey };
}
