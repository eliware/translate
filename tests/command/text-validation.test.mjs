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
});
