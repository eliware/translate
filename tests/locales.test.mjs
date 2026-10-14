import { locales } from "../src/locales.mjs";

describe("supported locales", () => {
  it("includes Discord locale IDs", () => {
    expect(locales).toContain("en-GB");
    expect(locales).toContain("zh-CN");
  });
});
