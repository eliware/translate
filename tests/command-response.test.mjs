import { formatCommandResponse } from "../src/command-response.mjs";

describe("formatCommandResponse", () => {
  it("formats valid JSON with indentation", () => {
    expect(formatCommandResponse('{"ok":true}')).toBe(JSON.stringify({ ok: true }, null, 2));
  });

  it("returns non-JSON output unchanged", () => {
    expect(formatCommandResponse("plain output")).toBe("plain output");
  });
});
