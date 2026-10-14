import { jest } from "@jest/globals";
import { translateLocale } from "../src/worker.mjs";

const defaultCallOpenAI = jest.fn().mockResolvedValue("default-result");
jest.unstable_mockModule("../src/openai.mjs", () => ({ callOpenAI: defaultCallOpenAI }));

describe("worker module", () => {
  it("exports the translation worker", () => {
    expect(typeof translateLocale).toBe("function");
  });

  it("accepts an omitted options object", async () => {
    await expect(translateLocale()).resolves.toBe("default-result");
  });

  it("calls callOpenAI with the locale and returns its result", async () => {
    const mockCallOpenAI = jest.fn().mockResolvedValue("result");
    const result = await translateLocale({
      locale: "fr",
      promptObj: { foo: "bar" },
      apiKey: "key",
      callOpenAIDep: mockCallOpenAI,
    });
    expect(mockCallOpenAI).toHaveBeenCalledWith({
      promptObj: { foo: "bar" },
      targetLocale: "fr",
      apiKey: "key",
    });
    expect(result).toBe("result");
  });

  it("loads the default OpenAI implementation when no dependency is injected", async () => {
    await expect(translateLocale({ locale: "fr", promptObj: {}, apiKey: "key" })).resolves.toBe(
      "default-result",
    );
    expect(defaultCallOpenAI).toHaveBeenCalledWith({
      promptObj: {},
      targetLocale: "fr",
      apiKey: "key",
    });
  });
});
