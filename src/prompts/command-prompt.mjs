import { replaceJsonMarkers } from "./json-marker.mjs";

export function injectCommandJson(promptObj, json) {
  if (!promptObj || !Array.isArray(promptObj.messages)) return false;
  if (replaceJsonMarkers(promptObj.messages, json)) return true;
  const first = promptObj.messages[0]?.content?.[0];
  if (!first || typeof first.text !== "string") return false;
  first.text += `\n\n${json}`;
  return true;
}
