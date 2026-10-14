import { jest } from "@jest/globals";
import { loadPrompt } from "../src/prompt.mjs";
import "../test-fixtures/prompt-default.test.mjs";

describe("loadPrompt", () => {
  it("loads a prompt and replaces its target locale", async () => {
    const fsDep = { readFile: jest.fn().mockResolvedValue("foo {target_locale} bar") };
    await expect(loadPrompt("prompt.json", "fr", fsDep)).resolves.toBe("foo fr bar");
    expect(fsDep.readFile).toHaveBeenCalledWith("prompt.json", "utf8");
  });

  it("leaves a prompt without the locale marker unchanged", async () => {
    const fsDep = { readFile: jest.fn().mockResolvedValue("plain") };
    await expect(loadPrompt("prompt.json", "fr", fsDep)).resolves.toBe("plain");
  });
});
