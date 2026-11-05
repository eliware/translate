import { validateCommandTextTree } from "../../../src/command/text/tree-validation.mjs";

describe("validateCommandTextTree", () => {
  it("ignores values that are not command records", () => {
    expect(validateCommandTextTree(null)).toEqual([]);
    expect(validateCommandTextTree({ name: "hello" })).toEqual([]);
  });
});
