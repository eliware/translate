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
