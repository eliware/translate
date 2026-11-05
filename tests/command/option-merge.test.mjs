import { mergeCommandOptions } from "../../src/command/option-merge.mjs";

describe("mergeCommandOptions", () => {
  it("returns a non-record source unchanged", () => {
    expect(mergeCommandOptions(null, {})).toBeNull();
  });

  it("merges translated fields throughout the source option tree", () => {
    const source = {
      name: "hello",
      type: 1,
      options: [{ name: "user", description: "User", type: 3, id: "123" }],
    };
    const translated = {
      name: "salut",
      options: [{ name: "utilisateur", name_localizations: { fr: "membre" } }],
    };
    expect(mergeCommandOptions(source, translated)).toEqual({
      name: "salut",
      type: 1,
      options: [
        {
          name: "utilisateur",
          description: "User",
          type: 3,
          id: "123",
          name_localizations: { fr: "membre" },
        },
      ],
    });
  });

  it("keeps source options when translated options are missing", () => {
    const source = { name: "hello", options: [{ name: "user", type: 3 }] };
    expect(mergeCommandOptions(source, { name: "salut" })).toEqual({
      name: "salut",
      options: source.options,
    });
  });
});
