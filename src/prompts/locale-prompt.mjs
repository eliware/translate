import { replaceJsonMarkers } from "./json-marker.mjs";

export function injectLocaleJson(promptObj, json) {
  if (!promptObj || !Array.isArray(promptObj.messages)) return false;
  const replaced = replaceJsonMarkers(promptObj.messages, json, true);
  if (replaced) return true;
  const first = promptObj.messages[0]?.content?.[0];
  if (!first || typeof first.text !== "string") return false;
  first.text = json;
  return true;
}
