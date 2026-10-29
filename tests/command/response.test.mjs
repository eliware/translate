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
    ).toThrow();
  });

  it("does not add description localizations to non-chat commands", () => {
    const source = { name: "hello", type: 2 };
    const result = formatCommandResponse(
      '{"name":"hello","description_localizations":{"fr":"salut"}}',
      source,
    );
    expect(JSON.parse(result)).toEqual(source);
  });

  it("rejects invalid description fields on non-chat commands", () => {
    const response = '{"name":"hello"}';
    expect(() =>
      formatCommandResponse(response, {
        name: "hello",
        type: 2,
        description_localizations: "invalid",
      }),
    ).toThrow("Command response failed validation");
    expect(() =>
      formatCommandResponse(response, { name: "hello", type: 2, description: "invalid" }),
    ).toThrow("Command response failed validation");
  });

  it("rejects names and descriptions that exceed Discord limits", () => {
    const source = { name: "hello", description: "Greeting", type: 1 };
    const longName = { name: "hello", name_localizations: { fr: "n".repeat(33) } };
    const longDescription = { name: "hello", description: "d".repeat(101) };
    expect(() => formatCommandResponse(JSON.stringify(longName), source)).toThrow(
      "Command response failed validation",
    );
    expect(() => formatCommandResponse(JSON.stringify(longDescription), source)).toThrow(
      "Command response failed validation",
    );
  });

  it("rejects unsupported localization keys", () => {
    expect(() =>
      formatCommandResponse('{"name":"hello","name_localizations":{"xx":"hola"}}', {
        name: "hello",
        type: 1,
      }),
    ).toThrow("Command response failed validation");
  });

  it("rejects descriptions and options on context commands", () => {
    expect(() =>
      formatCommandResponse('{"name":"hello"}', {
        name: "hello",
        type: 2,
        options: [{ name: "user", type: 3 }],
      }),
    ).toThrow("Command response failed validation");
    expect(() =>
      formatCommandResponse('{"name":"hello"}', { name: "hello", type: 2, options: [] }),
    ).toThrow("Command response failed validation");
  });

  it("keeps valid command groups with descriptions inside chat commands", () => {
    const source = {
      name: "hello",
      type: 1,
      options: [{ name: "group", description: "Group", type: 2 }],
    };
    expect(JSON.parse(formatCommandResponse('{"name":"hello"}', source))).toEqual(source);
  });

  it("reports the localization field and character limit that failed", () => {
    const source = { name: "hello", description: "Greeting", type: 1 };
    const response = JSON.stringify({
      name: "hello",
      description_localizations: { fr: "d".repeat(101) },
    });
    expect(() => formatCommandResponse(response, source)).toThrow(
      "command.description_localizations.fr must have no more than 100 characters",
    );
  });

  it("reports text and option shape failures", () => {
    expect(() => formatCommandResponse("{}", { name: 42, type: 1 })).toThrow(
      "command.name must be text",
    );
    expect(() => formatCommandResponse('{"name":""}', { name: "hello", type: 1 })).toThrow(
      "command.name must not be empty",
    );
    expect(() =>
      formatCommandResponse("{}", { name: "hello", type: 1, options: "invalid" }),
    ).toThrow("command.options must be an array");
  });
});
