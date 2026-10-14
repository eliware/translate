export function formatCommandResponse(result) {
  return JSON.stringify(JSON.parse(result), null, 2);
}
