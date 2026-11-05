import { validateCommandStructure } from "./structure-validation.mjs";
import { validateCommandText } from "./text-validation.mjs";

export function validateCommand(command) {
  return [...validateCommandStructure(command), ...validateCommandText(command)];
}
