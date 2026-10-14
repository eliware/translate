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
      pathDep: { join: (...parts) => parts.join("/") },
      processDep,
      dotenvConfigDep: (options) => dotenvCalls.push(options),
      translateLocaleDep: async (input) => {
        translateCalls.push(input);
        return '{"ok":true}';
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
    await expect(runTranslate(state.deps)).resolves.toBe(0);
    expect(state.dotenvCalls).toEqual([{ path: "/package/src/../.env", quiet: true }]);
    expect(state.translateCalls[0]).toMatchObject({ locale: "fr", apiKey: "key" });
    expect(state.writes).toEqual([["/target/fr.json", '{"ok":true}']]);
  });

  it("selects command mode when the target has no English locale file", async () => {
    const state = setup({ localeMode: false });
    await expect(runTranslate(state.deps)).resolves.toBe(0);
    expect(state.translateCalls[0]).toMatchObject({ locale: "", apiKey: "key" });
    expect(state.writes).toEqual([["/target/command.json", '{\n  "ok": true\n}', "utf8"]]);
  });

  it("reports missing environment files and API keys", async () => {
    const noEnv = setup({ envExists: false });
    await expect(runTranslate(noEnv.deps)).resolves.toBe(1);
    expect(noEnv.errors).toContain(".env file not found");

    const noKey = setup({ apiKey: "" });
    await expect(runTranslate(noKey.deps)).resolves.toBe(1);
    expect(noKey.errors).toContain("Missing OPENAI_API_KEY");
  });

  it("uses the default dependencies", async () => {
    const originalError = log.error;
    log.error = jest.fn();
    try {
      await expect(runTranslate()).resolves.toBe(1);
    } finally {
      log.error = originalError;
    }
  });
});
