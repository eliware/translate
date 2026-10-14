import { callOpenAI } from "../src/openai.mjs";
import "../test-fixtures/openai-default.test.mjs";
import "../test-fixtures/openai.test.mjs";

describe("OpenAI module", () => {
  it("exports the API call", () => {
    expect(typeof callOpenAI).toBe("function");
  });

  it("accepts an omitted options object", async () => {
    await expect(callOpenAI()).rejects.toThrow();
  });
});
