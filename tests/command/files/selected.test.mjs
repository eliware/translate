import { selectCommandFile } from "../../../src/command/files/selected.mjs";

describe("selectCommandFile", () => {
  it("resolves the selected file from the current directory", () => {
    expect(
      selectCommandFile({
        pathDep: { resolve: (base, file) => `${base}/${file}` },
        cwd: "/target",
        file: "one.json",
      }),
    ).toEqual({
      names: ["one.json"],
      inputs: [{ name: "one.json", filePath: "/target/one.json" }],
      invalidFiles: [],
    });
  });

  it("rejects a selected file without a JSON extension", () => {
    const result = selectCommandFile({
      pathDep: { resolve: (base, file) => `${base}/${file}` },
      cwd: "/target",
      file: "one.mjs",
    });
    expect(result.invalidFiles[0].error.message).toBe("Command file must use the .json extension");
    expect(result.inputs).toEqual([]);
  });
});
