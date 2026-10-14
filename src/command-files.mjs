export async function findCommandFiles({ fsDep, pathDep, cwd }) {
  const names = (await fsDep.readdir(cwd)).filter((name) => name.endsWith(".json"));
  const files = [];
  for (const name of names) {
    try {
      const raw = await fsDep.readFile(pathDep.join(cwd, name), "utf8");
      const data = JSON.parse(raw);
      if (typeof data.name === "string" && typeof data.type === "number") files.push({ name, raw });
    } catch {}
  }
  return { names, files };
}
