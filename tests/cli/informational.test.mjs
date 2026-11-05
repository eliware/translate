import { getInformationalOutput } from "../../src/cli/informational.mjs";

describe("getInformationalOutput", () => {
  it("returns help for no arguments and for --help alone", () => {
    const output = getInformationalOutput([], "15.1.1");
    expect(output).toContain("Usage: translate");
    expect(getInformationalOutput(["--help"], "15.1.1")).toBe(output);
  });

  it("returns the supplied package version for --version alone", () => {
    expect(getInformationalOutput(["--version"], "15.1.1")).toBe("15.1.1\n");
  });

  it("returns null for arguments that start a workflow or require parsing", () => {
    expect(getInformationalOutput(["--yes"], "15.1.1")).toBeNull();
    expect(getInformationalOutput(["--help", "--debug"], "15.1.1")).toBeNull();
  });
});
