// Prompt loading and template logic
// Accepts fs dependency for testability
export async function loadPrompt(promptPath, targetLocale, fsDep) {
  const fsImpl = fsDep || (await import("node:fs/promises"));
  const raw = await fsImpl.readFile(promptPath, "utf8");
  return raw.replace("{target_locale}", targetLocale);
}

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

export function setTargetLocale(promptObj, locale) {
  for (const message of promptObj?.messages || []) {
    for (const part of message?.content || []) {
      if (part?.type === "text" && typeof part.text === "string") {
        part.text = part.text.replace(/\{target_locale\}/g, locale);
      }
    }
  }
  return promptObj;
}
