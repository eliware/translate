import { mergeLocalizations } from "../../src/command/merge.mjs";

describe("mergeLocalizations", () => {
  it("drops malformed source values and non-text translations", () => {
    expect(mergeLocalizations({ fr: "bonjour", de: 4 }, { es: "hola", it: null })).toEqual({
      fr: "bonjour",
      es: "hola",
    });
  });
});
