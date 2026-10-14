import { injectLocaleJson } from "../src/locale-prompt.mjs";

describe("injectLocaleJson", () => {
  it("replaces each locale JSON marker", () => {
    const prompt = {
      messages: [
        { content: [{ type: "text", text: "first {json}" }] },
        { content: [{ type: "text", text: "second {json}" }] },
      ],
    };
    expect(injectLocaleJson(prompt, "source")).toBe(true);
    expect(prompt.messages.map(({ content }) => content[0].text)).toEqual([
      "first source",
      "second source",
    ]);
  });

  it("uses the first content part when no marker exists", () => {
    const prompt = { messages: [{ content: [{ text: "plain" }] }] };
    expect(injectLocaleJson(prompt, "source")).toBe(true);
    expect(prompt.messages[0].content[0].text).toBe("source");
  });

  it("rejects prompts without a usable message", () => {
    expect(injectLocaleJson(null, "source")).toBe(false);
    expect(injectLocaleJson({ messages: [] }, "source")).toBe(false);
    expect(injectLocaleJson({ messages: [{}] }, "source")).toBe(false);
  });
});
