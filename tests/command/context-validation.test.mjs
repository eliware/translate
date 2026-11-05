import { validateContextCommand } from "../../src/command/context-validation.mjs";

describe("validateContextCommand", () => {
  it("allows non-record values and context commands without restricted fields", () => {
    expect(validateContextCommand(null)).toEqual([]);
    expect(validateContextCommand({ name: "context", type: 2 })).toEqual([]);
    expect(validateContextCommand({ name: "chat", type: 1, description: "Greeting" })).toEqual([]);
  });

  it("rejects each restricted field on context commands", () => {
    for (const field of ["description", "description_localizations", "options"]) {
      expect(validateContextCommand({ name: "context", type: 2, [field]: [] })).toEqual([
        "command is a context command and cannot have descriptions or options.",
      ]);
    }
  });
});
