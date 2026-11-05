import { findCommandFiles } from "../../src/command/files.mjs";

describe("findCommandFiles", () => {
  it("selects JSON files from the current directory", async () => {
    const readPaths = [];
    const result = await findCommandFiles({
      fsDep: {
        readdir: async (path) => {
          expect(path).toBe("/target");
          return ["one.json", "readme.txt"];
        },
        readFile: async (path) => {
          readPaths.push(path);
          return '{"name":"hello","type":1}';
        },
      },
      pathDep: { join: (...parts) => parts.join("/") },
      cwd: "/target",
    });
    expect(readPaths).toEqual(["/target/one.json"]);
    expect(result.names).toEqual(["one.json"]);
    expect(result.files).toEqual([
      { name: "one.json", filePath: "/target/one.json", raw: '{"name":"hello","type":1}' },
    ]);
    expect(result.invalidFiles).toEqual([]);
  });

  it("propagates directory errors", async () => {
    const fsDep = {
      readdir: async () => {
        throw Error("directory missing");
      },
    };
    const pathDep = { join: (...parts) => parts.join("/") };
    await expect(findCommandFiles({ fsDep, pathDep, cwd: "/target" })).rejects.toThrow(
      "directory missing",
    );
  });

  it("reads one selected manifest without scanning the directory", async () => {
    const readPaths = [];
    const result = await findCommandFiles({
      fsDep: {
        readdir: async () => {
          throw Error("directory scan must not run");
        },
        readFile: async (path) => {
          readPaths.push(path);
          return '{"name":"hello","type":1}';
        },
      },
      pathDep: { resolve: (base, file) => `${base}/${file}` },
      cwd: "/target",
      file: "one.json",
    });
    expect(readPaths).toEqual(["/target/one.json"]);
    expect(result.files).toEqual([
      { name: "one.json", filePath: "/target/one.json", raw: '{"name":"hello","type":1}' },
    ]);
  });

  it("rejects a selected file without a JSON extension", async () => {
    const result = await findCommandFiles({
      fsDep: { readdir: async () => [], readFile: async () => "{}" },
      pathDep: { resolve: (base, file) => `${base}/${file}` },
      cwd: "/target",
      file: "one.mjs",
    });
    expect(result.invalidFiles[0].error.message).toBe("Command file must use the .json extension");
  });
});
