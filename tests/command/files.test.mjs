import { findCommandFiles } from "../../src/command/files.mjs";

describe("findCommandFiles", () => {
  it("returns JSON command files and parse errors", async () => {
    const files = new Map([
      ["good.json", '{"name":"hello","type":1}'],
      ["bad.json", "not json"],
      ["shape.json", '{"name":"hello"}'],
    ]);
    const result = await findCommandFiles({
      fsDep: {
        readdir: async () => ["good.json", "bad.json", "shape.json", "readme.txt"],
        readFile: async (path) => files.get(String(path).split("/").at(-1)),
      },
      pathDep: { join: (...parts) => parts.join("/") },
      cwd: "/target",
    });
    expect(result.names).toEqual(["good.json", "bad.json", "shape.json"]);
    expect(result.files).toEqual([
      {
        name: "good.json",
        filePath: "/target/good.json",
        raw: '{"name":"hello","type":1}',
      },
    ]);
    expect(result.invalidFiles.map(({ name }) => name)).toEqual(["bad.json"]);
    expect(result.invalidFiles[0].error.message).toMatch(/JSON/);
  });

  it("reports read errors and propagates directory errors", async () => {
    const fsDep = {
      readdir: async () => ["missing.json"],
      readFile: async () => {
        throw Error("file missing");
      },
    };
    const pathDep = { join: (...parts) => parts.join("/") };
    const missing = await findCommandFiles({ fsDep, pathDep, cwd: "/target" });
    expect(missing.invalidFiles[0].error.message).toBe("file missing");

    fsDep.readdir = async () => {
      throw Error("directory missing");
    };
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

  it("rejects a selected JSON file that is not a command manifest", async () => {
    const result = await findCommandFiles({
      fsDep: { readFile: async () => '{"name":"hello"}' },
      pathDep: { resolve: (base, file) => `${base}/${file}` },
      cwd: "/target",
      file: "one.json",
    });
    expect(result.invalidFiles[0].error.message).toBe("Input is not a command manifest");
  });
});
