import { readCommandManifest } from "../../src/command/manifest-reader.mjs";

describe("readCommandManifest", () => {
  it("reads a valid command manifest", async () => {
    const readCalls = [];
    const result = await readCommandManifest({
      fsDep: {
        readFile: async (...args) => {
          readCalls.push(args);
          return '{"name":"hello","type":1}';
        },
      },
      name: "hello.json",
      filePath: "/target/hello.json",
    });
    expect(readCalls).toEqual([["/target/hello.json", "utf8"]]);
    expect(result).toEqual({
      file: {
        name: "hello.json",
        filePath: "/target/hello.json",
        raw: '{"name":"hello","type":1}',
      },
    });
  });

  it("returns a distinct result for JSON that is not a command manifest", async () => {
    const result = await readCommandManifest({
      fsDep: { readFile: async () => '{"name":"hello"}' },
      name: "hello.json",
      filePath: "/target/hello.json",
    });
    expect(result).toEqual({ invalidManifest: true });
  });

  it("reports JSON parse and file read errors", async () => {
    const invalidJson = await readCommandManifest({
      fsDep: { readFile: async () => "not json" },
      name: "broken.json",
      filePath: "/target/broken.json",
    });
    expect(invalidJson.invalidFile.error.message).toBe("File is not valid JSON");

    const missingFile = await readCommandManifest({
      fsDep: {
        readFile: async () => {
          throw Error("file missing");
        },
      },
      name: "missing.json",
      filePath: "/target/missing.json",
    });
    expect(missingFile.invalidFile.error.message).toBe("file missing");
  });
});
