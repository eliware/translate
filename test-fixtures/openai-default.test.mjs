import { jest } from "@jest/globals";

const create = jest.fn().mockResolvedValue({ output_text: "default" });
const createOpenAI = jest.fn().mockImplementation(() => ({ responses: { create } }));
jest.unstable_mockModule("@eliware/openai", () => ({ createOpenAI }));
const { callOpenAI } = await import("../src/openai.mjs");

it("loads the default OpenAI implementation", async () => {
  await expect(callOpenAI({ promptObj: { messages: [] }, apiKey: "key" })).resolves.toBe("default");
});
