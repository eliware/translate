import { validateCommand } from "../../src/command/validation.mjs";

describe("validateCommand", () => {
  it("requires a command object", () => {
    expect(validateCommand(null)).toEqual(["command must be an object."]);
    expect(validateCommand([])).toEqual(["command must be an object."]);
  });

  it("checks command names and descriptions against text limits", () => {
    expect(
      validateCommand({
        name: 42,
        description: "",
        type: 1,
        name_localizations: { fr: "n".repeat(33) },
        description_localizations: { fr: "d".repeat(101) },
      }),
    ).toEqual([
      "command.name must be text.",
      "command.name_localizations.fr must have no more than 32 characters.",
      "command.description must not be empty.",
      "command.description_localizations.fr must have no more than 100 characters.",
    ]);
  });

  it("checks localization objects, locales, and values", () => {
    expect(
      validateCommand({
        name: "hello",
        type: 1,
        name_localizations: "invalid",
        description_localizations: { xx: "hola", fr: "", de: 3 },
      }),
    ).toEqual([
      "command.name_localizations must be an object.",
      "command.description_localizations.xx uses an unsupported locale.",
      "command.description_localizations.fr must not be empty.",
      "command.description_localizations.de must be text.",
    ]);
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
    expect(validateCommand({ name: "hello", type: 1, options: "invalid" })).toEqual([
      "command.options must be an array.",
    ]);
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
