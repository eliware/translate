import { collectLocalizationIssues, collectTextIssues, isRecord } from "./text-validation.mjs";

function collectCommandIssues(command, path, isOption, issues) {
  if (!isRecord(command)) {
    issues.push(`${path} must be an object.`);
    return;
  }
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
  if (
    !isOption &&
    command.type > 1 &&
    (Object.hasOwn(command, "description") ||
      Object.hasOwn(command, "description_localizations") ||
      Object.hasOwn(command, "options"))
  ) {
    issues.push(`${path} is a context command and cannot have descriptions or options.`);
  }
  if (command.options !== undefined && !Array.isArray(command.options)) {
    issues.push(`${path}.options must be an array.`);
    return;
  }
  if (Array.isArray(command.options)) {
    command.options.forEach((option, index) =>
      collectCommandIssues(option, `${path}.options[${index}]`, true, issues),
    );
  }
}

export function validateCommand(command) {
  const issues = [];
  collectCommandIssues(command, "command", false, issues);
  return issues;
}
