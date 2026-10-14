import { setTargetLocale } from "./target-locale.mjs";

export function preparePromptForLocale(promptObj, locale) {
  return setTargetLocale(JSON.parse(JSON.stringify(promptObj)), locale);
}
