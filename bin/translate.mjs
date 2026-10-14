#!/usr/bin/env node
import { log, registerHandlers, registerSignals } from "@eliware/common";
import packageData from "../package.json" with { type: "json" };
import { runTranslate } from "../src/main.mjs";

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === "--help") {
  process.stdout.write(
    "Usage: translate [--help | --version]\nTranslate locale files or command manifests in the current directory.\n",
  );
  process.exitCode = 0;
} else if (args.length === 1 && args[0] === "--version") {
  process.stdout.write(`${packageData.version}\n`);
  process.exitCode = 0;
} else if (args.length > 0) {
  log.error("Unsupported command argument", { args });
  process.exitCode = 1;
} else {
  const errorHandlers = registerHandlers();
  const signalHandlers = registerSignals({
    shutdownHook: () => errorHandlers.removeHandlers(),
  });

  try {
    process.exitCode = await runTranslate();
  } catch (error) {
    log.error("Translation failed", { error });
    process.exitCode = 1;
  } finally {
    errorHandlers.removeHandlers();
    signalHandlers.removeHandlers();
  }
}
