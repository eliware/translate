import { isLocaleResponse } from "../../src/locale/response.mjs";

describe("isLocaleResponse", () => {
  it("accepts translated strings with the same nested JSON structure", () => {
    expect(
      isLocaleResponse(
        { greeting: "Hello", nested: { farewell: "Goodbye" }, count: 2, flags: [true, false] },
        '{"greeting":"Bonjour","nested":{"farewell":"Au revoir"},"count":2,"flags":[true,false]}',
      ),
    ).toBe(true);
  });

  it("rejects invalid JSON, wrong roots, and changed structure", () => {
    const source = { greeting: "Hello", nested: { farewell: "Goodbye" }, count: 2 };
    expect(isLocaleResponse(source, "not JSON")).toBe(false);
    expect(isLocaleResponse(source, '"Bonjour"')).toBe(false);
    expect(isLocaleResponse(source, '{"greeting":"Bonjour","nested":{},"count":2}')).toBe(false);
    expect(isLocaleResponse(source, '{"greeting":"Bonjour","nested":{"farewell":"Salut"}}')).toBe(
      false,
    );
    expect(
      isLocaleResponse(source, '{"greeting":"Bonjour","nested":{"farewell":1},"count":2}'),
    ).toBe(false);
    expect(isLocaleResponse(["Hello"], '["Bonjour"]')).toBe(false);
  });
});
