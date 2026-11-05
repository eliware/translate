import { isRecord } from "../record.mjs";
import { collectLocalizationIssues } from "./localizations.mjs";
import { collectCommandNameIssues, collectTextIssues } from "./values.mjs";

function collectCommandTextIssues(command, path, issues, isChatInput) {
  if (!isRecord(command)) return;
  if (isChatInput) collectCommandNameIssues(command.name, `${path}.name`, issues);
  else collectTextIssues(command.name, `${path}.name`, 32, issues);
  collectLocalizationIssues(
    command.name_localizations,
    `${path}.name_localizations`,
    32,
    issues,
    isChatInput,
  );
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
      collectCommandTextIssues(option, `${path}.options[${index}]`, issues, isChatInput),
    );
  }
}

export function validateCommandTextTree(command) {
  const issues = [];
  collectCommandTextIssues(command, "command", issues, isRecord(command) && command.type === 1);
  return issues;
}
