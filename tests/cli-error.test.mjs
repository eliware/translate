import { jest } from "@jest/globals";
import { createErrorWriter } from "../src/cli-error.mjs";

describe("createErrorWriter", () => {
  it("trims an error before it writes the error", () => {
    const error = jest.fn();
    createErrorWriter({ error })("  Failed.\n");
    expect(error).toHaveBeenCalledWith("Failed.");
  });
});
