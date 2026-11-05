import { isRecord } from "./record.mjs";

export function validateContextCommand(command) {
  if (
    isRecord(command) &&
    command.type > 1 &&
    (Object.hasOwn(command, "description") ||
      Object.hasOwn(command, "description_localizations") ||
      Object.hasOwn(command, "options"))
  ) {
    return ["command is a context command and cannot have descriptions or options."];
  }
  return [];
}
