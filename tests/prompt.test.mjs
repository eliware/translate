import { jest } from "@jest/globals";
import { loadPrompt, setTargetLocale } from "../src/prompt.mjs";
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

describe("setTargetLocale", () => {
  it("replaces locale markers in text parts", () => {
    const prompt = {
      messages: [
        {
          content: [
            { type: "text", text: "Translate to {target_locale} and repeat {target_locale}" },
          ],
        },
      ],
    };
    expect(setTargetLocale(prompt, "fr")).toBe(prompt);
    expect(prompt.messages[0].content[0].text).toBe("Translate to fr and repeat fr");
  });

  it("accepts missing prompts and skips non-text parts", () => {
    const prompt = { messages: [null, { content: [{ type: "image" }, { text: 1 }] }] };
    expect(setTargetLocale(null, "fr")).toBeNull();
    expect(setTargetLocale(prompt, "fr")).toBe(prompt);
  });
});
