import { validateContextCommand } from "./context-validation.mjs";
import { validateCommandStructure } from "./structure-validation.mjs";
import { validateCommandText } from "./text-validation.mjs";

export function validateCommand(command) {
  return [
    ...validateCommandStructure(command),
    ...validateContextCommand(command),
    ...validateCommandText(command),
  ];
}
