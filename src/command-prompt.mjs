export function injectCommandJson(promptObj, json) {
  if (!promptObj || !Array.isArray(promptObj.messages)) return false;
  for (const message of promptObj.messages) {
    for (const part of message?.content || []) {
      if (part?.type === "text" && typeof part.text === "string" && part.text.includes("{json}")) {
        part.text = part.text.replace("{json}", json);
        return true;
      }
    }
  }
  const first = promptObj.messages[0]?.content?.[0];
  if (!first || typeof first.text !== "string") return false;
  first.text += `\n\n${json}`;
  return true;
}
