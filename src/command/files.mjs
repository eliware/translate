import { isCommandManifest } from "./manifest.mjs";

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
    try {
      const raw = await fsDep.readFile(filePath, "utf8");
      const data = JSON.parse(raw);
      if (isCommandManifest(data)) files.push({ name, filePath, raw });
      else if (file)
        invalidFiles.push({ name, error: new Error("Input is not a command manifest") });
    } catch (error) {
      invalidFiles.push({
        name,
        error: error instanceof SyntaxError ? new Error("File is not valid JSON") : error,
      });
    }
  }
  return { names, files, invalidFiles };
}
