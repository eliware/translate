export function createErrorWriter(logDep) {
  return (message) => logDep.error(message.trim());
}
