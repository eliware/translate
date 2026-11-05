import { collectLocalizationIssues } from "../../../src/command/text/localizations.mjs";

describe("collectLocalizationIssues", () => {
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
});
