import { preparePromptForLocale } from "../../src/prompts/prepare-target-locale.mjs";

describe("preparePromptForLocale", () => {
  it("returns a translated copy and preserves the original prompt", () => {
    const prompt = {
      messages: [{ content: [{ type: "text", text: "Translate to {target_locale}" }] }],
    };
    const prepared = preparePromptForLocale(prompt, "fr");
    expect(prepared.messages[0].content[0].text).toBe("Translate to fr");
    expect(prompt.messages[0].content[0].text).toBe("Translate to {target_locale}");
    expect(prepared).not.toBe(prompt);
  });
});
