import { validateCommandText } from "../../src/command/text-validation.mjs";

describe("validateCommandText", () => {
  it("checks text and localization values in nested command options", () => {
    expect(
      validateCommandText({
        name: "hello",
        options: [{ name: "", name_localizations: { xx: "hola" } }],
      }),
    ).toEqual([
      "command.options[0].name must not be empty.",
      "command.options[0].name_localizations.xx uses an unsupported locale.",
    ]);
  });

  it("checks chat input names and localized names against Discord rules", () => {
    expect(
      validateCommandText({
        name: "Hello World",
        type: 1,
        name_localizations: { fr: "salut!" },
        options: [{ name: "Good morning", type: 3 }],
      }),
    ).toEqual([
      "command.name contains characters that Discord does not allow in chat input names.",
      "command.name must use lowercase letters when lowercase forms exist.",
      "command.name_localizations.fr contains characters that Discord does not allow in chat input names.",
      "command.options[0].name contains characters that Discord does not allow in chat input names.",
      "command.options[0].name must use lowercase letters when lowercase forms exist.",
    ]);
  });

  it("allows spaces and uppercase letters in context command names", () => {
    expect(validateCommandText({ name: "Kick Member", type: 2 })).toEqual([]);
  });
});
