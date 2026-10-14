import { setTargetLocale } from "../../src/prompts/target-locale.mjs";

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
