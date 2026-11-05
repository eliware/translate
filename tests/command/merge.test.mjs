import { mergeCommandFields, mergeLocalizations } from "../../src/command/merge.mjs";

describe("mergeLocalizations", () => {
  it("drops malformed source values and non-text translations", () => {
    expect(mergeLocalizations({ fr: "bonjour", de: 4 }, { es: "hola", it: null })).toEqual({
      fr: "bonjour",
      es: "hola",
    });
  });
});

describe("mergeCommandFields", () => {
  it("returns a non-record source unchanged", () => {
    expect(mergeCommandFields(null, {})).toBeNull();
  });

  it("updates command text and leaves nested options for the tree merger", () => {
    const options = [{ name: "user", type: 3 }];
    const source = { name: "hello", description: "Greeting", type: 1, options };
    expect(mergeCommandFields(source, { name: "bonjour", description: 4 })).toEqual({
      name: "bonjour",
      description: "Greeting",
      type: 1,
      options,
    });
  });
});
