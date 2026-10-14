import { runCommandMode } from "../src/command-mode.mjs";

function setup({ names = ["one.json", "bad.json", "note.txt"], response = '{"ok":true}' } = {}) {
  const files = new Map([
    ["prompt-commands.json", '{"messages":[{"content":[{"type":"text","text":"{json}"}]}]}'],
    ["one.json", '{"name":"one","type":1}'],
    ["bad.json", "not json"],
  ]);
  const writes = [];
  const errors = [];
  const deps = {
    fsDep: {
      readdir: async () => names,
      readFile: async (path) => {
        const value = files.get(String(path).split("/").at(-1));
        if (value === undefined) throw Error("read failed");
        return value;
      },
      writeFile: async (...args) => writes.push(args),
    },
    pathDep: { join: (...parts) => parts.join("/") },
    cwd: "/target",
    moduleDir: "/package/src",
    apiKey: "key",
    translateLocaleDep: async () => response,
    writeError: (message) => errors.push(message),
  };
  return { deps, files, writes, errors };
}

describe("runCommandMode", () => {
  it("translates detected manifests and formats valid JSON", async () => {
    const state = setup();
    await expect(runCommandMode(state.deps)).resolves.toBe(0);
    expect(state.writes).toEqual([["/target/one.json", '{\n  "ok": true\n}', "utf8"]]);
    expect(state.errors).toEqual([]);
  });

  it("keeps non-JSON output and appends JSON when the prompt has no marker", async () => {
    const state = setup({ response: "plain output" });
    state.files.set("prompt-commands.json", '{"messages":[{"content":[{"text":"Rules"}]}]}');
    await runCommandMode(state.deps);
    expect(state.writes[0][1]).toBe("plain output");
  });

  it("reports directory, empty input, and manifest errors", async () => {
    const unreadable = setup();
    unreadable.deps.fsDep.readdir = async () => {
      throw Error("directory error");
    };
    await expect(runCommandMode(unreadable.deps)).resolves.toBe(1);

    const empty = setup({ names: [] });
    await expect(runCommandMode(empty.deps)).resolves.toBe(1);

    const noManifest = setup({ names: ["bad.json"] });
    await expect(runCommandMode(noManifest.deps)).resolves.toBe(1);
    expect(noManifest.errors).toContain("No command JSON manifests detected in this directory\n");
  });

  it("reports a missing or invalid command prompt", async () => {
    const state = setup();
    state.deps.fsDep.readFile = async (path) => {
      if (String(path).endsWith("prompt-commands.json")) throw Error("missing");
      return '{"name":"one","type":1}';
    };
    await expect(runCommandMode(state.deps)).resolves.toBe(1);
    expect(state.errors).toContain("Failed to read or parse prompt-commands.json\n");
  });

  it("reports failed prompt injection and translation", async () => {
    const noInject = setup();
    noInject.files.set("prompt-commands.json", '{"messages":[{"content":[]}]}');
    await expect(runCommandMode(noInject.deps)).resolves.toBe(1);
    expect(noInject.errors).toContain("Could not inject command JSON into prompt for one.json\n");

    const translateFail = setup();
    translateFail.deps.translateLocaleDep = async () => {
      throw Error("translation failed");
    };
    await expect(runCommandMode(translateFail.deps)).resolves.toBe(1);
    expect(translateFail.errors).toContain("Failed to translate command file one.json\n");
  });

  it("continues with other manifests after one translation fails", async () => {
    const state = setup({ names: ["one.json", "two.json"] });
    state.files.set("two.json", '{"name":"two","type":1}');
    state.deps.translateLocaleDep = async ({ promptObj }) => {
      if (promptObj.messages[0].content[0].text.includes('"name":"one"')) {
        throw Error("translation failed");
      }
      return '{"translated":true}';
    };
    await expect(runCommandMode(state.deps)).resolves.toBe(1);
    expect(state.writes).toHaveLength(1);
    expect(state.writes[0][0]).toBe("/target/two.json");
  });
});
