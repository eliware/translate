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
} = {}) {
  const moduleDir = moduleDirDep || getCurrentDirname(importMeta, pathDep.dirname);
  const dotenvPath = pathDep.join(moduleDir, "..", ".env");
  try {
    await fsDep.access(dotenvPath);
  } catch {
    return { error: ".env file not found" };
  }
  dotenvConfigDep({ path: dotenvPath, quiet: true });
  const apiKey = processDep.env.OPENAI_API_KEY;
  if (!apiKey) return { error: "Missing OPENAI_API_KEY" };
  return { moduleDir, dotenvPath, apiKey };
}
