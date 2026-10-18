export function isCommandManifest(data) {
  return typeof data?.name === "string" && typeof data?.type === "number";
}
