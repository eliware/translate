export async function findDirectoryInputs({ fsDep, pathDep, cwd }) {
  const names = (await fsDep.readdir(cwd)).filter((name) => name.endsWith(".json"));
  const inputs = names.map((name) => ({ name, filePath: pathDep.join(cwd, name) }));
  return { names, inputs };
}
