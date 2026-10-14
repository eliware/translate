import { jest } from "@jest/globals";
import { callOpenAI } from "../src/openai.mjs";

describe("callOpenAI", () => {
  it("calls the shared OpenAI client and returns content", async () => {
    const mockCreate = jest.fn().mockResolvedValue({ output_text: "translated" });
    const mockOpenAI = jest.fn().mockImplementation(() => ({ responses: { create: mockCreate } }));
    const promptObj = {
      model: "gpt",
      messages: [
        { role: "user", content: [{ type: "text", text: "en" }] },
        {
          role: "user",
          content: [{ type: "text", text: "Translate this to locale: {target_locale}." }],
        },
      ],
      response_format: {},
      temperature: 1,
      max_completion_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    const result = await callOpenAI({
      promptObj,
      targetLocale: "fr",
      apiKey: "key",
      createOpenAIDep: mockOpenAI,
    });
    expect(mockOpenAI).toHaveBeenCalledWith({ apiKey: "key" });
    expect(mockCreate).toHaveBeenCalledWith({
      model: "gpt",
      input: [
        { role: "user", content: [{ type: "input_text", text: "en" }] },
        {
          role: "user",
          content: [{ type: "input_text", text: "Translate this to locale: fr." }],
        },
      ],
      text: { format: {} },
      temperature: 1,
      max_output_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    expect(result).toBe("translated");
    expect(promptObj.messages[1].content[0].text).toBe(
      "Translate this to locale: {target_locale}.",
    );
  });

  it("supports prompts without a translatable second message", async () => {
    const create = jest.fn().mockResolvedValue({ output_text: "ok" });
    const OpenAI = jest.fn().mockImplementation(() => ({ responses: { create } }));
    await callOpenAI({
      promptObj: { messages: [] },
      targetLocale: "fr",
      apiKey: "key",
      createOpenAIDep: OpenAI,
    });
    expect(create).toHaveBeenCalled();
  });
});
