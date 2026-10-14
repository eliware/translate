import { pLimit } from "../src/p-limit.mjs";
import "../test-fixtures/p-limit.test.mjs";

describe("limit module", () => {
  it("exports the limiter", () => {
    expect(typeof pLimit).toBe("function");
  });
});
