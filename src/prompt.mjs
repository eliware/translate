// Prompt loading and template logic
// Accepts fs dependency for testability
export async function loadPrompt(promptPath, targetLocale, fsDep) {
  const fsImpl = fsDep || (await import("node:fs/promises"));
  const raw = await fsImpl.readFile(promptPath, "utf8");
  return raw.replace("{target_locale}", targetLocale);
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
