export function replaceJsonMarkers(messages, json, replaceAll = false) {
  let replaced = false;
  for (const message of messages) {
    for (const part of message?.content || []) {
      if (part?.type !== "text" || typeof part.text !== "string" || !part.text.includes("{json}")) {
        continue;
      }
      part.text = part.text.replace("{json}", json);
      replaced = true;
      if (!replaceAll) return true;
    }
  }
  return replaced;
}
