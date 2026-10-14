import { runLocaleMode } from "../src/locale-mode.mjs";
import "../test-fixtures/main.test.mjs";
import "../test-fixtures/main-branches.test.mjs";

describe("locale mode", () => {
  it("exports the locale workflow", () => {
    expect(typeof runLocaleMode).toBe("function");
  });
});
