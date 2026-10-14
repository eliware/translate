import { createProgressBar } from "../src/progress.mjs";
import "../test-fixtures/progress.test.mjs";

describe("progress module", () => {
  it("exports the progress bar factory", () => {
    expect(typeof createProgressBar).toBe("function");
  });
});
