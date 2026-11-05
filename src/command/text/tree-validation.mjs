import { collectLocalizationIssues, collectTextIssues, isRecord } from "./checks.mjs";

function collectCommandTextIssues(command, path, issues) {
  if (!isRecord(command)) return;
  collectTextIssues(command.name, `${path}.name`, 32, issues);
  collectLocalizationIssues(command.name_localizations, `${path}.name_localizations`, 32, issues);
  if (Object.hasOwn(command, "description")) {
    collectTextIssues(command.description, `${path}.description`, 100, issues);
  }
  collectLocalizationIssues(
    command.description_localizations,
    `${path}.description_localizations`,
    100,
    issues,
  );
  if (Array.isArray(command.options)) {
    command.options.forEach((option, index) =>
      collectCommandTextIssues(option, `${path}.options[${index}]`, issues),
    );
  }
}

export function validateCommandTextTree(command) {
  const issues = [];
  collectCommandTextIssues(command, "command", issues);
  return issues;
}
