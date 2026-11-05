import { validateCommandStructure } from "../../src/command/structure-validation.mjs";

describe("validateCommandStructure", () => {
  it("requires command and option records", () => {
    expect(validateCommandStructure(null)).toEqual(["command must be an object."]);
    expect(validateCommandStructure({ name: "hello", options: [null] })).toEqual([
      "command.options[0] must be an object.",
    ]);
  });

  it("requires an array for options and allows nested option groups", () => {
    expect(validateCommandStructure({ name: "hello", options: "invalid" })).toEqual([
      "command.options must be an array.",
    ]);
    expect(
      validateCommandStructure({
        name: "hello",
        type: 1,
        options: [{ name: "group", type: 2, options: [{ name: "child", type: 3 }] }],
      }),
    ).toEqual([]);
  });
});
