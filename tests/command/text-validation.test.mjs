import {
  collectLocalizationIssues,
  collectTextIssues,
  isRecord,
  validateCommandText,
} from "../../src/command/text-validation.mjs";

describe("command text validation", () => {
  it("recognizes non-array records", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord("text")).toBe(false);
  });

  it("checks text type, empty values, and maximum length", () => {
    const issues = [];
    collectTextIssues(3, "command.name", 32, issues);
    collectTextIssues("", "command.description", 100, issues);
    collectTextIssues("x".repeat(33), "command.name_localizations.fr", 32, issues);
    expect(issues).toEqual([
      "command.name must be text.",
      "command.description must not be empty.",
      "command.name_localizations.fr must have no more than 32 characters.",
    ]);
  });

  it("checks localization maps and supported locale values", () => {
    const issues = [];
    collectLocalizationIssues(undefined, "command.name_localizations", 32, issues);
    collectLocalizationIssues("invalid", "command.name_localizations", 32, issues);
    collectLocalizationIssues(
      { fr: "bonjour", "en-US": "hello", xx: "hola", de: "", ja: 2 },
      "command.name_localizations",
      32,
      issues,
    );
    collectLocalizationIssues(
      { fr: "x".repeat(101) },
      "command.description_localizations",
      100,
      issues,
    );
    expect(issues).toEqual([
      "command.name_localizations must be an object.",
      "command.name_localizations.xx uses an unsupported locale.",
      "command.name_localizations.de must not be empty.",
      "command.name_localizations.ja must be text.",
      "command.description_localizations.fr must have no more than 100 characters.",
    ]);
  });

  it("checks text and localizations in nested command options", () => {
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
