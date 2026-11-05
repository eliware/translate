import { parseArgs } from "../../src/cli/args.mjs";

describe("parseArgs", () => {
  it("returns empty options when no arguments are present", () => {
    expect(parseArgs([])).toEqual({ options: {} });
  });

  it("parses processing options in any order", () => {
    expect(parseArgs(["--debug", "--file", "commands/lock.json", "--yes"])).toEqual({
      options: { debug: true, commandFile: "commands/lock.json", yes: true },
    });
    expect(parseArgs(["--dry-run", "--file", "C:\\commands\\lock.json"])).toEqual({
      options: { dryRun: true, commandFile: "C:\\commands\\lock.json" },
    });
  });

  it("requires a file path after --file", () => {
    expect(parseArgs(["--file"])).toEqual({ error: "Add a file path after --file." });
    expect(parseArgs(["--file", "--debug"])).toEqual({
      error: "Add a file path after --file.",
    });
  });

  it("rejects unsupported arguments", () => {
    expect(parseArgs(["commands/lock.json"])).toEqual({
      error: "Unsupported command argument: commands/lock.json",
    });
  });
});
