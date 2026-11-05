import { isRecord } from "./text/checks.mjs";

function collectCommandStructureIssues(command, path, issues) {
  if (!isRecord(command)) {
    issues.push(`${path} must be an object.`);
    return;
  }
  if (command.options !== undefined && !Array.isArray(command.options)) {
    issues.push(`${path}.options must be an array.`);
    return;
  }
  if (Array.isArray(command.options)) {
    command.options.forEach((option, index) =>
      collectCommandStructureIssues(option, `${path}.options[${index}]`, issues),
    );
  }
}

export function validateCommandStructure(command) {
  const issues = [];
  collectCommandStructureIssues(command, "command", issues);
  return issues;
}
