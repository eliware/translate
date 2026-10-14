import { jest } from "@jest/globals";
import { loadRuntimeConfig } from "../src/config.mjs";

function setup({ apiKey = "key", readable = true } = {}) {
  const fsDep = {
    access: jest.fn(async () => {
      if (!readable) throw Error("missing env");
    }),
  };
  const pathDep = {
    dirname: jest.fn(() => "/package/src"),
    join: jest.fn((...parts) => parts.join("/")),
  };
  const dotenvConfigDep = jest.fn();
  const processDep = { env: apiKey ? { OPENAI_API_KEY: apiKey } : {} };
  return { fsDep, pathDep, dotenvConfigDep, processDep };
}

describe("loadRuntimeConfig", () => {
  it("accepts omitted options", async () => {
    await expect(loadRuntimeConfig()).resolves.toEqual(expect.any(Object));
  });

  it("loads the environment file and returns the runtime settings", async () => {
    const deps = setup();
    await expect(loadRuntimeConfig({ ...deps, moduleDirDep: "/package/src" })).resolves.toEqual({
      moduleDir: "/package/src",
      dotenvPath: "/package/src/../.env",
      apiKey: "key",
    });
    expect(deps.fsDep.access).toHaveBeenCalledWith("/package/src/../.env");
    expect(deps.dotenvConfigDep).toHaveBeenCalledWith({
      path: "/package/src/../.env",
      quiet: true,
    });
  });

  it("derives the module directory from import metadata", async () => {
    const deps = setup();
    const result = await loadRuntimeConfig(deps);
    expect(result.moduleDir).toBe("/package/src");
    expect(deps.pathDep.dirname).toHaveBeenCalledWith(expect.stringMatching(/config\.mjs$/));
  });

  it("uses native filesystem and path defaults", async () => {
    await expect(
      loadRuntimeConfig({ moduleDirDep: "C:\\path-that-does-not-exist\\src" }),
    ).resolves.toEqual({
      error: ".env file not found",
    });
  });

  it("uses native dotenv and process defaults", async () => {
    const fsDep = { access: async () => {} };
    const pathDep = { dirname: () => "/package/src", join: (...parts) => parts.join("/") };
    await expect(
      loadRuntimeConfig({
        fsDep,
        pathDep,
        processDep: { env: { OPENAI_API_KEY: "key" } },
        moduleDirDep: "/package/src",
      }),
    ).resolves.toMatchObject({ apiKey: "key" });

    const apiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      await expect(
        loadRuntimeConfig({
          fsDep,
          pathDep,
          dotenvConfigDep: () => {},
          moduleDirDep: "/package/src",
        }),
      ).resolves.toEqual({ error: "Missing OPENAI_API_KEY" });
    } finally {
      if (apiKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = apiKey;
    }
  });

  it("reports a missing environment file or API key", async () => {
    const noEnv = setup({ readable: false });
    await expect(loadRuntimeConfig({ ...noEnv, moduleDirDep: "/package/src" })).resolves.toEqual({
      error: ".env file not found",
    });
    expect(noEnv.dotenvConfigDep).not.toHaveBeenCalled();

    const noKey = setup({ apiKey: "" });
    await expect(loadRuntimeConfig({ ...noKey, moduleDirDep: "/package/src" })).resolves.toEqual({
      error: "Missing OPENAI_API_KEY",
    });
  });
});
