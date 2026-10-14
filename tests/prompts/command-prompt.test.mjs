import { injectCommandJson, loadCommandPrompt } from "../../src/prompts/command-prompt.mjs";

describe("injectCommandJson", () => {
  it("replaces the first command JSON marker", () => {
    const prompt = {
      messages: [
        { content: [{ type: "text", text: "manifest: {json}" }] },
        { content: [{ type: "text", text: "{json}" }] },
      ],
    };
    expect(injectCommandJson(prompt, "command")).toBe(true);
    expect(prompt.messages[0].content[0].text).toBe("manifest: command");
    expect(prompt.messages[1].content[0].text).toBe("{json}");
  });

  it("adds command JSON after the first content part when no marker exists", () => {
    const prompt = { messages: [{ content: [{ text: "rules" }] }] };
    expect(injectCommandJson(prompt, "command")).toBe(true);
    expect(prompt.messages[0].content[0].text).toBe("rules\n\ncommand");
  });

  it("rejects prompts without a usable message", () => {
    expect(injectCommandJson(null, "command")).toBe(false);
    expect(injectCommandJson({ messages: [] }, "command")).toBe(false);
    expect(injectCommandJson({ messages: [{}] }, "command")).toBe(false);
  });
});

describe("loadCommandPrompt", () => {
  it("reads and parses the command prompt file", async () => {
    const fsDep = { readFile: async () => '{"messages":[]}' };
    const pathDep = { join: (...parts) => parts.join("/") };
    await expect(loadCommandPrompt({ fsDep, pathDep, moduleDir: "/package/src" })).resolves.toEqual(
      { messages: [] },
    );
  });

  it("propagates prompt read and parse errors", async () => {
    const pathDep = { join: (...parts) => parts.join("/") };
    await expect(
      loadCommandPrompt({
        fsDep: {
          readFile: async () => {
            throw Error("read failed");
          },
        },
        pathDep,
        moduleDir: "/package/src",
      }),
    ).rejects.toThrow("read failed");
    await expect(
      loadCommandPrompt({
        fsDep: { readFile: async () => "not JSON" },
        pathDep,
        moduleDir: "/package/src",
      }),
    ).rejects.toThrow();
  });
});
