import { validateCommand } from "../../src/command/validation.mjs";

describe("validateCommand", () => {
  it("requires a command object", () => {
    expect(validateCommand(null)).toEqual(["command must be an object."]);
    expect(validateCommand([])).toEqual(["command must be an object."]);
  });

  it("rejects descriptions and options on context commands", () => {
    expect(
      validateCommand({
        name: "hello",
        type: 2,
        description: "Greeting",
        description_localizations: { fr: "salut" },
        options: [],
      }),
    ).toContain("command is a context command and cannot have descriptions or options.");
  });

  it("checks option arrays and nested option objects", () => {
    expect(validateCommand({ name: "hello", type: 1, options: "invalid" })).toContain(
      "command.options must be an array.",
    );
    expect(validateCommand({ name: "hello", type: 1, options: [null] })).toContain(
      "command.options[0] must be an object.",
    );
  });

  it("accepts valid command groups and optional fields", () => {
    expect(
      validateCommand({
        name: "hello",
        type: 1,
        options: [
          {
            name: "group",
            description: "Group",
            type: 2,
            name_localizations: { "en-US": "group" },
          },
        ],
      }),
    ).toEqual([]);
    expect(validateCommand({ name: "context", type: 2 })).toEqual([]);
  });
});
