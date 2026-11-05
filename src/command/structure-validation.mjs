import { isRecord } from "./text-validation.mjs";

function collectCommandStructureIssues(command, path, isOption, issues) {
  if (!isRecord(command)) {
    issues.push(`${path} must be an object.`);
    return;
  }
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
      collectCommandStructureIssues(option, `${path}.options[${index}]`, true, issues),
    );
  }
}

export function validateCommandStructure(command) {
  const issues = [];
  collectCommandStructureIssues(command, "command", false, issues);
  return issues;
}
