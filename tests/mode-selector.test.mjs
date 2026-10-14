import { selectTranslationMode } from "../src/mode-selector.mjs";

describe("selectTranslationMode", () => {
  it("selects locale mode when the English source exists", async () => {
    const fsDep = { access: async () => {} };
    const pathDep = { join: (...parts) => parts.join("/") };
    await expect(selectTranslationMode({ fsDep, pathDep, cwd: "/target" })).resolves.toBe("locale");
  });

  it("selects command mode when the English source is not available", async () => {
    const fsDep = {
      access: async () => {
        throw Error("missing source");
      },
    };
    const pathDep = { join: (...parts) => parts.join("/") };
    await expect(selectTranslationMode({ fsDep, pathDep, cwd: "/target" })).resolves.toBe(
      "command",
    );
  });
});
