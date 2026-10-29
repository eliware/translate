import { jest } from "@jest/globals";
import { createErrorWriter, writeDebugError } from "../src/cli-error.mjs";

describe("createErrorWriter", () => {
  it("trims an error before it writes the error", () => {
    const error = jest.fn();
    createErrorWriter({ error })("  Failed.\n");
    expect(error).toHaveBeenCalledWith("Failed.");
  });
});

describe("writeDebugError", () => {
  it("writes the error context and message when debug is active", () => {
    const writeDebug = jest.fn();
    writeDebugError({
      debug: true,
      writeDebug,
      context: "file.json",
      error: Error("invalid JSON"),
    });
    expect(writeDebug).toHaveBeenCalledWith("Debug file.json: invalid JSON\n");
  });

  it("does not write details when debug is inactive", () => {
    const writeDebug = jest.fn();
    writeDebugError({ debug: false, writeDebug, context: "file.json", error: Error("failure") });
    expect(writeDebug).not.toHaveBeenCalled();
  });
});
