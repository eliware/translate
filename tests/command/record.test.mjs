import { isRecord } from "../../src/command/record.mjs";

describe("isRecord", () => {
  it("accepts non-array objects and rejects other values", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord("text")).toBe(false);
  });
});
