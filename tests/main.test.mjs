import { runTranslate } from "../src/main.mjs";
import { log } from "@eliware/common";
import "../test-fixtures/main.test.mjs";
import "../test-fixtures/main-branches.test.mjs";

describe("main module", () => {
  it("exports the translate runner", () => {
    expect(typeof runTranslate).toBe("function");
  });

  it("uses default dependencies", async () => {
    const originalError = log.error;
    log.error = () => {};
    try {
      await runTranslate();
    } finally {
      log.error = originalError;
    }
  });
});
