import { formatCommandResponse } from "../../src/command/response.mjs";

describe("formatCommandResponse", () => {
  it("preserves manifest fields and merges translated command localizations", () => {
    const source = {
      name: "hello",
      description: "Greeting",
      type: 1,
      id: "123",
      name_localizations: { fr: "bonjour" },
      options: [{ name: "user", description: "User", type: 3 }],
    };
    const response = {
      name: "hello",
      name_localizations: { de: "hallo", es: 3 },
      description_localizations: { fr: "Salutation" },
      options: [{ name_localizations: { fr: "utilisateur" } }],
    };
    expect(JSON.parse(formatCommandResponse(JSON.stringify(response), source))).toEqual({
      name: "hello",
      description: "Greeting",
      type: 1,
      id: "123",
      name_localizations: { fr: "bonjour", de: "hallo" },
      description_localizations: { fr: "Salutation" },
      options: [
        {
          name: "user",
          description: "User",
          type: 3,
          name_localizations: { fr: "utilisateur" },
        },
      ],
    });
  });

  it("rejects non-JSON output", () => {
    expect(() => formatCommandResponse("plain output", { name: "hello", type: 1 })).toThrow();
  });

  it("rejects non-object command responses", () => {
    expect(() => formatCommandResponse("[]", { name: "hello", type: 1 })).toThrow(
      "Command response must be an object",
    );
    expect(() => formatCommandResponse("{}", null)).toThrow("Command response must be an object");
  });

  it("keeps absent fields and options from the source", () => {
    const source = { name: "hello", type: 1, options: [{ name: "user", type: 3 }] };
    expect(JSON.parse(formatCommandResponse('{"name":"hello"}', source))).toEqual(source);
    expect(() =>
      formatCommandResponse('{"name":"hello"}', { name: "hello", type: 1, options: [null] }),
    ).toThrow("Command response failed validation");
  });

  it("omits translated description localizations for non-chat commands", () => {
    const source = { name: "hello", type: 2 };
    const result = formatCommandResponse(
      '{"name":"hello","description_localizations":{"fr":"salut"}}',
      source,
    );
    expect(JSON.parse(result)).toEqual(source);
  });

  it("rejects a merged response that fails command validation", () => {
    expect(() =>
      formatCommandResponse('{"name":"hello"}', { name: "hello", type: 2, options: [] }),
    ).toThrow("Command response failed validation");
  });
});
