import { replaceJsonMarkers } from "../../src/prompts/json-marker.mjs";

describe("replaceJsonMarkers", () => {
  it("replaces the first marker and stops when replaceAll is false", () => {
    const messages = [
      { content: [{ type: "text", text: "first {json}" }] },
      { content: [{ type: "text", text: "second {json}" }] },
    ];
    expect(replaceJsonMarkers(messages, "data")).toBe(true);
    expect(messages.map(({ content }) => content[0].text)).toEqual(["first data", "second {json}"]);
  });

  it("replaces markers in all text parts when replaceAll is true", () => {
    const messages = [
      { content: [{ type: "text", text: "first {json}" }] },
      { content: [{ type: "text", text: "second {json}" }] },
    ];
    expect(replaceJsonMarkers(messages, "data", true)).toBe(true);
    expect(messages.map(({ content }) => content[0].text)).toEqual(["first data", "second data"]);
  });

  it("returns false when messages have no usable marker", () => {
    expect(replaceJsonMarkers([], "data")).toBe(false);
    expect(
      replaceJsonMarkers(
        [null, { content: [{ type: "image" }, { type: "text", text: 1 }] }],
        "data",
      ),
    ).toBe(false);
  });
});
