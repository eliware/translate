import { isCommandManifest } from "./manifest.mjs";

export async function findCommandFiles({ fsDep, pathDep, cwd }) {
  const names = (await fsDep.readdir(cwd)).filter((name) => name.endsWith(".json"));
  const files = [];
  const invalidFiles = [];
  for (const name of names) {
    try {
      const raw = await fsDep.readFile(pathDep.join(cwd, name), "utf8");
      const data = JSON.parse(raw);
      if (isCommandManifest(data)) files.push({ name, raw });
    } catch {
      invalidFiles.push(name);
    }
  }
  return { names, files, invalidFiles };
}
