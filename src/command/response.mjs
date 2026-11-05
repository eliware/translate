import { mergeCommandOptions } from "./option-merge.mjs";
import { isRecord } from "./text-validation.mjs";
import { validateCommand } from "./validation.mjs";

export function formatCommandResponse(result, source) {
  let translated;
  try {
    translated = JSON.parse(result);
  } catch {
    throw new TypeError("Model response is not valid JSON.");
  }
  if (!isRecord(translated) || !isRecord(source))
    throw new TypeError("Command response must be an object");
  const output = mergeCommandOptions(source, translated);
  const issues = validateCommand(output);
  if (issues.length > 0) {
    throw new TypeError(`Command response failed validation: ${issues.join(" ")}`);
  }
  return JSON.stringify(output, null, 2);
}
