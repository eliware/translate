import { mergeCommandFields } from "../../src/command/fields.mjs";

describe("mergeCommandFields", () => {
  it("returns a non-record source unchanged", () => {
    expect(mergeCommandFields(null, {})).toBeNull();
  });

  it("updates command text and localization fields", () => {
    const source = {
      name: "hello",
      description: "Greeting",
      type: 1,
      name_localizations: { fr: "bonjour" },
    };
    expect(
      mergeCommandFields(source, {
        name: "salut",
        description: 4,
        name_localizations: { es: "hola" },
      }),
    ).toEqual({
      name: "salut",
      description: "Greeting",
      type: 1,
      name_localizations: { fr: "bonjour", es: "hola" },
    });
  });
});
