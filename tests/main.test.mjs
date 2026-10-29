import { jest } from "@jest/globals";
import { log } from "@eliware/common";
import { runTranslate } from "../src/main.mjs";

function setup({ localeMode = true, envExists = true, apiKey = "key" } = {}) {
  const writes = [];
  const errors = [];
  const files = new Map([
    ["prompt.json", '{"messages":[{"content":[{"type":"text","text":"{json}"}]}]}'],
    ["prompt-commands.json", '{"messages":[{"content":[{"type":"text","text":"{json}"}]}]}'],
    ["en-US.json", '{"en":"Hello"}'],
    ["command.json", '{"name":"hello","type":1}'],
  ]);
  const fsDep = {
    access: async (path) => {
      if (String(path).endsWith(".env") && !envExists) throw Error("no env");
      if (String(path).endsWith("en-US.json") && !localeMode) throw Error("no locale source");
    },
    readFile: async (path) => {
      const value = files.get(String(path).split("/").at(-1));
      if (value === undefined) throw Error("read failed");
      return value;
    },
    writeFile: async (...args) => writes.push(args),
    readdir: async () => ["command.json"],
  };
  const processDep = {
    env: apiKey ? { OPENAI_API_KEY: apiKey } : {},
    cwd: () => "/target",
    stdout: {},
  };
  const dotenvCalls = [];
  const translateCalls = [];
  return {
    deps: {
      fsDep,
      pathDep: {
        join: (...parts) => parts.join("/"),
        resolve: (base, file) => `${base}/${file}`,
      },
      processDep,
      dotenvConfigDep: (options) => dotenvCalls.push(options),
      translateLocaleDep: async (input) => {
        translateCalls.push(input);
        return input.locale ? '{"en":"Hello"}' : '{"name":"hello","type":1}';
      },
      createProgressBarDep: () => ({ update: () => {} }),
      logDep: { error: (message) => errors.push(message) },
      moduleDirDep: "/package/src",
      locales: ["fr"],
    },
    writes,
    errors,
    files,
    dotenvCalls,
    translateCalls,
  };
}

describe("runTranslate", () => {
  it("loads the package environment and translates locale files", async () => {
    const state = setup();
    await expect(runTranslate({ ...state.deps, yes: true })).resolves.toBe(0);
    expect(state.dotenvCalls).toEqual([{ path: "/package/src/../.env", quiet: true }]);
    expect(state.translateCalls[0]).toMatchObject({ locale: "fr", apiKey: "key" });
    expect(state.writes).toEqual([["/target/fr.json", '{"en":"Hello"}']]);
  });

  it("selects command mode when the target has no English locale file", async () => {
    const state = setup({ localeMode: false });
    await expect(runTranslate({ ...state.deps, yes: true })).resolves.toBe(0);
    expect(state.translateCalls[0]).toMatchObject({ locale: "", apiKey: "key" });
    expect(state.writes).toEqual([
      ["/target/command.json", '{\n  "name": "hello",\n  "type": 1\n}', "utf8"],
    ]);
  });

  it("uses command mode for one selected file", async () => {
    const state = setup();
    state.deps.fsDep.readdir = async () => {
      throw Error("directory scan must not run");
    };
    await expect(
      runTranslate({ ...state.deps, yes: true, commandFile: "command.json" }),
    ).resolves.toBe(0);
    expect(state.translateCalls).toHaveLength(1);
    expect(state.writes).toEqual([
      ["/target/command.json", '{\n  "name": "hello",\n  "type": 1\n}', "utf8"],
    ]);
  });

  it("uses the default debug output handler for selected command files", async () => {
    const state = setup();
    state.deps.translateLocaleDep = async () =>
      JSON.stringify({
        name: "hello",
        type: 1,
        description_localizations: { fr: "d".repeat(101) },
      });
    await expect(
      runTranslate({ ...state.deps, yes: true, debug: true, commandFile: "command.json" }),
    ).resolves.toBe(1);
    expect(state.errors).toContain("Invalid command response for command file command.json");
    expect(state.writes).toEqual([]);
  });

  it("lists files without an API key, an OpenAI call, or file writes by default", async () => {
    const state = setup({ apiKey: "" });
    await expect(runTranslate(state.deps)).resolves.toBe(0);
    expect(state.translateCalls).toEqual([]);
    expect(state.writes).toEqual([]);
  });

  it("keeps dry-run active when --yes is also set", async () => {
    const state = setup();
    await expect(
      runTranslate({ ...state.deps, yes: true, dryRun: true, writeInfo: () => {} }),
    ).resolves.toBe(0);
    expect(state.translateCalls).toEqual([]);
    expect(state.writes).toEqual([]);
  });

  it("reports missing environment files and API keys", async () => {
    const noEnv = setup({ envExists: false });
    await expect(runTranslate({ ...noEnv.deps, yes: true })).resolves.toBe(1);
    expect(noEnv.errors).toContain(".env file not found");

    const noKey = setup({ apiKey: "" });
    await expect(runTranslate({ ...noKey.deps, yes: true })).resolves.toBe(1);
    expect(noKey.errors).toContain("Missing OPENAI_API_KEY");
  });

  it("uses the default dependencies", async () => {
    const originalError = log.error;
    const cwd = jest.spyOn(process, "cwd").mockReturnValue("/missing-target");
    log.error = jest.fn();
    try {
      await expect(runTranslate()).resolves.toBe(1);
    } finally {
      log.error = originalError;
      cwd.mockRestore();
    }
  });
});
