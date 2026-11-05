import { isRecord } from "./record.mjs";
import { mergeCommandFields } from "./fields.mjs";

export function mergeCommandOptions(source, translated) {
  if (!isRecord(source)) return source;
  const output = mergeCommandFields(source, translated);
  if (Array.isArray(source.options)) {
    output.options = source.options.map((option, index) => {
      const translatedOption = Array.isArray(translated.options) ? translated.options[index] : null;
      return mergeCommandOptions(option, isRecord(translatedOption) ? translatedOption : {});
    });
  }
  return output;
}
