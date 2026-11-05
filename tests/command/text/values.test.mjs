import { collectCommandNameIssues, collectTextIssues } from "../../../src/command/text/values.mjs";

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

describe("collectCommandNameIssues", () => {
  it("checks Discord chat input name characters and lowercase forms", () => {
    const issues = [];
    collectCommandNameIssues("Hello world!", "command.name", issues);
    expect(issues).toEqual([
      "command.name contains characters that Discord does not allow in chat input names.",
      "command.name must use lowercase letters when lowercase forms exist.",
    ]);
  });

  it("allows valid lowercase names in supported scripts", () => {
    const issues = [];
    collectCommandNameIssues("hello-नमस्ते", "command.name", issues);
    collectCommandNameIssues("こんにちは", "command.name", issues);
    expect(issues).toEqual([]);
  });
});
