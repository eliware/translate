import { findDirectoryInputs } from "../../../src/command/files/directory.mjs";

describe("findDirectoryInputs", () => {
  it("selects top-level JSON names and builds file paths", async () => {
    const result = await findDirectoryInputs({
      fsDep: {
        readdir: async (path) => {
          expect(path).toBe("/target");
          return ["one.json", "readme.txt", "nested.JSON"];
        },
      },
      pathDep: { join: (...parts) => parts.join("/") },
      cwd: "/target",
    });
    expect(result).toEqual({
      names: ["one.json"],
      inputs: [{ name: "one.json", filePath: "/target/one.json" }],
    });
  });
});
