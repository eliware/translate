export function injectLocaleJson(promptObj, json) {
  if (!promptObj || !Array.isArray(promptObj.messages)) return false;
  let replaced = false;
  for (const message of promptObj.messages) {
    for (const part of message?.content || []) {
      if (part?.type === "text" && typeof part.text === "string" && part.text.includes("{json}")) {
        part.text = part.text.replace("{json}", json);
        replaced = true;
      }
    }
  }
  if (replaced) return true;
  const first = promptObj.messages[0]?.content?.[0];
  if (!first || typeof first.text !== "string") return false;
  first.text = json;
  return true;
}
