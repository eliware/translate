import { readCommandManifest } from "./manifest-reader.mjs";
import { findDirectoryInputs } from "./files/directory.mjs";
import { selectCommandFile } from "./files/selected.mjs";

export async function findCommandFiles({ fsDep, pathDep, cwd, file }) {
  const files = [];
  const selection = file
    ? selectCommandFile({ pathDep, cwd, file })
    : await findDirectoryInputs({ fsDep, pathDep, cwd });
  const { names, inputs } = selection;
  const invalidFiles = [...(selection.invalidFiles ?? [])];
  for (const { name, filePath } of inputs) {
    const result = await readCommandManifest({ fsDep, name, filePath });
    if (result.file) files.push(result.file);
    if (result.invalidFile) invalidFiles.push(result.invalidFile);
    if (result.invalidManifest)
      invalidFiles.push({ name, error: new Error("Input is not a command manifest") });
  }
  return { names, files, invalidFiles };
}
