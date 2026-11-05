export function createErrorWriter(logDep) {
  return (message) => logDep.error(message.trim());
}

export function writeDebugError({ debug, writeDebug, context, error }) {
  if (debug) writeDebug(`Debug ${context}: ${error.message}\n`);
}
