import { runCommandMode } from "../src/command-mode.mjs";
import "../test-fixtures/main-branches.test.mjs";

describe("command mode", () => {
  it("exports the command workflow", () => {
    expect(typeof runCommandMode).toBe("function");
  });
});
