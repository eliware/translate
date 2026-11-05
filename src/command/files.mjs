import { readCommandManifest } from "./manifest-reader.mjs";

export async function findCommandFiles({ fsDep, pathDep, cwd, file }) {
  const files = [];
  const invalidFiles = [];
  let inputs;
  let names;
  if (file) {
    const filePath = pathDep.resolve(cwd, file);
    names = [file];
    if (!file.toLowerCase().endsWith(".json")) {
      return {
        names,
        files,
        invalidFiles: [
          { name: file, error: new Error("Command file must use the .json extension") },
        ],
      };
    }
    const name = file;
    inputs = [{ name, filePath }];
  } else {
    names = (await fsDep.readdir(cwd)).filter((name) => name.endsWith(".json"));
    inputs = names.map((name) => ({ name, filePath: pathDep.join(cwd, name) }));
  }
  for (const { name, filePath } of inputs) {
    const result = await readCommandManifest({ fsDep, name, filePath });
    if (result.file) files.push(result.file);
    if (result.invalidFile) invalidFiles.push(result.invalidFile);
    if (result.invalidManifest && file)
      invalidFiles.push({ name, error: new Error("Input is not a command manifest") });
  }
  return { names, files, invalidFiles };
}
