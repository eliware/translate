export function selectCommandFile({ pathDep, cwd, file }) {
  const filePath = pathDep.resolve(cwd, file);
  const names = [file];
  if (!file.toLowerCase().endsWith(".json")) {
    return {
      names,
      inputs: [],
      invalidFiles: [{ name: file, error: new Error("Command file must use the .json extension") }],
    };
  }
  return { names, inputs: [{ name: file, filePath }], invalidFiles: [] };
}
