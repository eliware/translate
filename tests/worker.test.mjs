import { translateLocale } from "../src/worker.mjs";
import "../test-fixtures/worker-default.test.mjs";
import "../test-fixtures/worker.test.mjs";

describe("worker module", () => {
  it("exports the translation worker", () => {
    expect(typeof translateLocale).toBe("function");
  });

  it("accepts an omitted options object", async () => {
    await expect(translateLocale()).resolves.toBe("default-result");
  });
});
