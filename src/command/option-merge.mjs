import { isRecord } from "./record.mjs";
import { mergeCommandFields } from "./fields.mjs";

export function mergeCommandOptions(source, translated, isRoot = true) {
  if (!isRecord(source)) return source;
  const allowsDescriptionLocalizations = !isRoot || (source.type !== 2 && source.type !== 3);
  const output = mergeCommandFields(source, translated, allowsDescriptionLocalizations);
  if (Array.isArray(source.options)) {
    output.options = source.options.map((option, index) => {
      const translatedOption = Array.isArray(translated.options) ? translated.options[index] : null;
      return mergeCommandOptions(option, isRecord(translatedOption) ? translatedOption : {}, false);
    });
  }
  return output;
}
