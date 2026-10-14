import {
  injectCommandJson,
  injectLocaleJson,
  loadPrompt,
  setTargetLocale,
} from "../src/prompt.mjs";
import "../test-fixtures/prompt-default.test.mjs";
import "../test-fixtures/prompt.test.mjs";

describe("prompt injection", () => {
  it("inserts JSON into locale and command prompts", () => {
    const localePrompt = { messages: [{ content: [{ type: "text", text: "{json}" }] }] };
    const commandPrompt = structuredClone(localePrompt);
    expect(injectLocaleJson(localePrompt, "source")).toBe(true);
    expect(injectCommandJson(commandPrompt, "manifest")).toBe(true);
    expect(setTargetLocale(localePrompt, "fr").messages[0].content[0].text).toBe("source");
    expect(setTargetLocale(null, "fr")).toBeNull();
    expect(typeof loadPrompt).toBe("function");
  });
});
