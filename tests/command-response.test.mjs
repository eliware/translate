import { formatCommandResponse } from "../src/command-response.mjs";

describe("formatCommandResponse", () => {
  it("formats valid JSON with indentation", () => {
    expect(formatCommandResponse('{"ok":true}')).toBe(JSON.stringify({ ok: true }, null, 2));
  });

  it("rejects non-JSON output", () => {
    expect(() => formatCommandResponse("plain output")).toThrow();
  });
});
