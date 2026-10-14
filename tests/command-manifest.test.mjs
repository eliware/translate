import { isCommandManifest } from "../src/command-manifest.mjs";

describe("isCommandManifest", () => {
  it("accepts objects with a string name and numeric type", () => {
    expect(isCommandManifest({ name: "hello", type: 1 })).toBe(true);
  });

  it("rejects missing or invalid command fields", () => {
    expect(isCommandManifest(null)).toBe(false);
    expect(isCommandManifest({ type: 1 })).toBe(false);
    expect(isCommandManifest({ name: "hello", type: "1" })).toBe(false);
  });
});
