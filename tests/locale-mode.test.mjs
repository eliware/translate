import { runLocaleMode } from "../src/locale-mode.mjs";

function setup({
  source = '{"en":"Hello"}',
  prompt = '{"messages":[{"content":[{"type":"text","text":"{json} {target_locale}"}]}]}',
} = {}) {
  const files = new Map([
    ["en-US.json", source],
    ["prompt.json", prompt],
  ]);
  const writes = [];
  const errors = [];
  const updates = [];
  const deps = {
    fsDep: {
      readFile: async (path) => {
        const value = files.get(String(path).split("/").at(-1));
        if (value === undefined) throw Error("read failed");
        return value;
      },
      writeFile: async (...args) => writes.push(args),
    },
    pathDep: { join: (...parts) => parts.join("/") },
    processDep: { stdout: {} },
    cwd: "/target",
    moduleDir: "/package/src",
    apiKey: "key",
    locales: ["fr"],
    translateLocaleDep: async ({ promptObj }) => promptObj.messages[0].content[0].text,
    createProgressBarDep: () => ({ update: (locale) => updates.push(locale) }),
    writeError: (message) => errors.push(message),
  };
  return { deps, files, writes, errors, updates };
}

describe("runLocaleMode", () => {
  it("translates locales and preserves the English source", async () => {
    const state = setup({
      prompt:
        '{"messages":[{"content":[{"type":"text","text":"Translate {json} to {target_locale}"}]}]}',
    });
    state.deps.locales = ["fr", "en-US"];
    await expect(runLocaleMode(state.deps)).resolves.toBe(0);
    expect(state.writes).toEqual(
      expect.arrayContaining([
        ["/target/fr.json", 'Translate {"en":"Hello"} to fr'],
        ["/target/en-US.json", '{"en":"Hello"}'],
      ]),
    );
    expect(state.updates).toEqual(expect.arrayContaining(["fr", "en-US"]));
  });

  it("reports source and prompt read or parse errors", async () => {
    const sourceFail = setup();
    sourceFail.deps.fsDep.readFile = async () => {
      throw Error("read failed");
    };
    await expect(runLocaleMode(sourceFail.deps)).resolves.toBe(1);

    const promptRead = setup();
    promptRead.deps.fsDep.readFile = async (path) => {
      if (String(path).endsWith("prompt.json")) throw Error("missing prompt");
      return '{"en":"Hello"}';
    };
    await expect(runLocaleMode(promptRead.deps)).resolves.toBe(1);
    expect(promptRead.errors).toContain("Failed to read prompt.json\n");

    const promptParse = setup({ prompt: "not json" });
    await expect(runLocaleMode(promptParse.deps)).resolves.toBe(1);
    expect(promptParse.errors).toContain("Failed to parse prompt.json\n");
  });

  it("rejects prompts without a usable content part", async () => {
    const state = setup({ prompt: '{"messages":[]}' });
    await expect(runLocaleMode(state.deps)).resolves.toBe(1);
    expect(state.errors).toContain("Invalid prompt.json structure\n");
  });

  it("reports a failed locale translation", async () => {
    const state = setup();
    state.deps.locales = ["fr"];
    state.deps.translateLocaleDep = async () => {
      throw Error("translation failed");
    };
    await expect(runLocaleMode(state.deps)).resolves.toBe(1);
    expect(state.errors).toContain("Failed to translate fr\n");
    expect(state.updates).toContain("fr");
  });

  it("reports a failed write to the English source", async () => {
    const state = setup();
    state.deps.locales = ["en-US"];
    state.deps.fsDep.writeFile = async () => {
      throw Error("write failed");
    };
    await expect(runLocaleMode(state.deps)).resolves.toBe(1);
    expect(state.errors).toContain("Failed to write en-US.json\n");
    expect(state.updates).toContain("en-US");
  });
});
