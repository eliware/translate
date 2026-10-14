import { setTargetLocale } from "./prompt.mjs";

export async function callOpenAI({ promptObj, targetLocale, apiKey, createOpenAIDep } = {}) {
  const createClient = createOpenAIDep || (await import("@eliware/openai")).createOpenAI;
  const { messages } = setTargetLocale(JSON.parse(JSON.stringify(promptObj)), targetLocale);
  const client = createClient({ apiKey });
  const response = await client.responses.create({
    model: promptObj.model,
    input: messages.map(({ role, content }) => ({
      role,
      content: content.map(({ text }) => ({ type: "input_text", text })),
    })),
    text: promptObj.response_format ? { format: promptObj.response_format } : undefined,
    temperature: promptObj.temperature,
    max_output_tokens: promptObj.max_completion_tokens,
    top_p: promptObj.top_p,
    frequency_penalty: promptObj.frequency_penalty,
    presence_penalty: promptObj.presence_penalty,
  });
  return response.output_text;
}
