import { isRecord } from "./record.mjs";

export function validateContextCommand(command) {
  if (!isRecord(command)) return [];

  if (
    (command.type === 2 || command.type === 3) &&
    (Object.hasOwn(command, "description") ||
      Object.hasOwn(command, "description_localizations") ||
      Object.hasOwn(command, "options"))
  ) {
    return ["command is a context command and cannot have descriptions or options."];
  }

  if (command.type === 4 && Object.hasOwn(command, "options")) {
    return ["primary entry point commands cannot have options."];
  }

  return [];
}
