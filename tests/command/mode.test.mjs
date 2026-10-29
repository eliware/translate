import { runCommandMode } from "../../src/command/mode.mjs";

function setup({ names = ["one.json"], response = '{"ok":true}' } = {}) {
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
    pathDep: {
      join: (...parts) => parts.join("/"),
      resolve: (base, file) => `${base}/${file}`,
    },
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
    expect(state.writes).toEqual([
      ["/target/one.json", '{\n  "name": "one",\n  "type": 1\n}', "utf8"],
    ]);
    expect(state.errors).toEqual([]);
  });

  it("translates one selected manifest without reading the other files", async () => {
    const state = setup({ names: ["one.json", "two.json"] });
    state.files.set("two.json", '{"name":"two","type":1}');
    const readPaths = [];
    const readFile = state.deps.fsDep.readFile;
    state.deps.fsDep.readdir = async () => {
      throw Error("directory scan must not run");
    };
    state.deps.fsDep.readFile = async (path, encoding) => {
      readPaths.push(path);
      return readFile(path, encoding);
    };
    await expect(runCommandMode({ ...state.deps, file: "one.json" })).resolves.toBe(0);
    expect(readPaths.filter((path) => path.startsWith("/target/"))).toEqual(["/target/one.json"]);
    expect(state.writes).toEqual([
      ["/target/one.json", '{\n  "name": "one",\n  "type": 1\n}', "utf8"],
    ]);
  });

  it("lists command targets without API calls or file writes in dry-run mode", async () => {
    const state = setup();
    const messages = [];
    state.deps.dryRun = true;
    state.deps.writeInfo = (message) => messages.push(message);
    let translateCalls = 0;
    state.deps.translateLocaleDep = async () => {
      translateCalls += 1;
      return '{"name":"one","type":1}';
    };
    await expect(runCommandMode(state.deps)).resolves.toBe(0);
    expect(translateCalls).toBe(0);
    expect(state.writes).toEqual([]);
    expect(messages).toEqual(["Target file: one.json\n"]);
  });

  it("returns failure for invalid files during dry-run", async () => {
    const state = setup({ names: ["one.json", "bad.json"] });
    state.deps.dryRun = true;
    await expect(runCommandMode(state.deps)).resolves.toBe(1);
    expect(state.writes).toEqual([]);
  });

  it("does not write non-JSON output and reports the invalid response", async () => {
    const state = setup({ response: "plain output" });
    state.files.set("prompt-commands.json", '{"messages":[{"content":[{"text":"Rules"}]}]}');
    await expect(runCommandMode(state.deps)).resolves.toBe(1);
    expect(state.writes).toEqual([]);
    expect(state.errors).toContain("Invalid command response for command file one.json\n");
  });

  it("reports directory, empty input, and manifest errors", async () => {
    const unreadable = setup();
    unreadable.deps.fsDep.readdir = async () => {
      throw Error("directory error");
    };
    unreadable.deps.debug = true;
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

    const debugState = setup();
    debugState.deps.debug = true;
    debugState.deps.writeDebug = (message) => debugState.errors.push(message);
    debugState.deps.fsDep.readFile = async (path) => {
      if (String(path).endsWith("prompt-commands.json")) throw Error("prompt missing");
      return '{"name":"one","type":1}';
    };
    await expect(runCommandMode(debugState.deps)).resolves.toBe(1);
    expect(debugState.errors).toContain("Debug prompt-commands.json: prompt missing\n");
  });

  it("reports failed prompt injection and translation", async () => {
    const noInject = setup();
    noInject.files.set("prompt-commands.json", '{"messages":[{"content":[]}]}');
    await expect(runCommandMode(noInject.deps)).resolves.toBe(1);
    expect(noInject.errors).toContain("Could not inject command JSON into prompt for one.json\n");

    const translateFail = setup();
    const debugMessages = [];
    translateFail.deps.debug = true;
    translateFail.deps.writeDebug = (message) => debugMessages.push(message);
    translateFail.deps.translateLocaleDep = async () => {
      throw Error("translation failed");
    };
    await expect(runCommandMode(translateFail.deps)).resolves.toBe(1);
    expect(translateFail.errors).toContain("Failed to translate command file one.json\n");
    expect(debugMessages).toContain("Debug one.json: translation failed\n");
  });

  it("continues with other manifests after one translation fails", async () => {
    const state = setup({ names: ["one.json", "two.json"] });
    state.files.set("two.json", '{"name":"two","type":1}');
    state.deps.translateLocaleDep = async ({ promptObj }) => {
      if (promptObj.messages[0].content[0].text.includes('"name":"one"')) {
        throw Error("translation failed");
      }
      return '{"name":"two","type":1,"name_localizations":{"fr":"deux"}}';
    };
    await expect(runCommandMode(state.deps)).resolves.toBe(1);
    expect(state.writes).toHaveLength(1);
    expect(state.writes[0][0]).toBe("/target/two.json");
    expect(JSON.parse(state.writes[0][1])).toEqual({
      name: "two",
      type: 1,
      name_localizations: { fr: "deux" },
    });
  });

  it("reports malformed manifests and still translates valid manifests", async () => {
    const state = setup({ names: ["one.json", "bad.json"] });
    const debugMessages = [];
    state.deps.debug = true;
    state.deps.writeDebug = (message) => debugMessages.push(message);
    await expect(runCommandMode(state.deps)).resolves.toBe(1);
    expect(state.writes).toHaveLength(1);
    expect(state.errors).toContain("Could not read or parse JSON file bad.json\n");
    expect(debugMessages).toContain("Debug bad.json: File is not valid JSON\n");
  });

  it("does not write a command response with an overlong localized name", async () => {
    const response = JSON.stringify({
      name: "one",
      type: 1,
      name_localizations: { fr: "n".repeat(33) },
    });
    const state = setup({ response });
    await expect(runCommandMode(state.deps)).resolves.toBe(1);
    expect(state.writes).toEqual([]);
    expect(state.errors).toContain("Invalid command response for command file one.json\n");
  });

  it("shows the failed field and reason in debug mode", async () => {
    const response = JSON.stringify({
      name: "one",
      type: 1,
      description_localizations: { fr: "d".repeat(101) },
    });
    const state = setup({ response });
    const debugMessages = [];
    await expect(
      runCommandMode({
        ...state.deps,
        debug: true,
        writeDebug: (message) => debugMessages.push(message),
      }),
    ).resolves.toBe(1);
    expect(state.errors).toContain("Invalid command response for command file one.json\n");
    expect(debugMessages).toContain(
      "Debug one.json: Command response failed validation: command.description_localizations.fr must have no more than 100 characters.\n",
    );
  });
});
