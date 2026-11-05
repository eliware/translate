import { validateCommandTextTree } from "./text/tree-validation.mjs";

export function validateCommandText(command) {
  return validateCommandTextTree(command);
}
