import { findCommandFiles } from "../src/command-files.mjs";

describe("findCommandFiles", () => {
  it("returns JSON files with command fields", async () => {
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
    expect(result).toEqual({
      names: ["good.json", "bad.json", "shape.json"],
      files: [{ name: "good.json", raw: '{"name":"hello","type":1}' }],
    });
  });

  it("skips files that cannot be read and propagates directory errors", async () => {
    const fsDep = {
      readdir: async () => ["missing.json"],
      readFile: async () => {
        throw Error("file missing");
      },
    };
    await expect(
      findCommandFiles({ fsDep, pathDep: { join: (...parts) => parts.join("/") }, cwd: "/target" }),
    ).resolves.toEqual({ names: ["missing.json"], files: [] });

    fsDep.readdir = async () => {
      throw Error("directory missing");
    };
    await expect(
      findCommandFiles({ fsDep, pathDep: { join: (...parts) => parts.join("/") }, cwd: "/target" }),
    ).rejects.toThrow("directory missing");
  });
});
