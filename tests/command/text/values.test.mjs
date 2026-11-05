import { collectTextIssues } from "../../../src/command/text/values.mjs";

describe("collectTextIssues", () => {
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
});
