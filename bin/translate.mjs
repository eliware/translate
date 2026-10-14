#!/usr/bin/env node
import { log, registerHandlers, registerSignals } from "@eliware/common";
import packageData from "../package.json" with { type: "json" };
import { runTranslate } from "../src/main.mjs";

const args = process.argv.slice(2);
async function run(options) {
  const errorHandlers = registerHandlers();
  const signalHandlers = registerSignals({
    shutdownHook: () => errorHandlers.removeHandlers(),
  });
  try {
    return await runTranslate(options);
  } catch (error) {
    log.error("Translation failed", { error });
    return 1;
  } finally {
    errorHandlers.removeHandlers();
    signalHandlers.removeHandlers();
  }
}

if (args.length === 0 || (args.length === 1 && args[0] === "--help")) {
  process.stdout.write(
    "Usage: translate [--help | --version | --dry-run | --yes]\nTranslate locale files or command manifests in the current directory.\n",
  );
  process.stdout.write(
    "Use --dry-run to list target files. Use --yes to send requests and write files.\n",
  );
  process.exitCode = 0;
} else if (args.length === 1 && args[0] === "--version") {
  process.stdout.write(`${packageData.version}\n`);
  process.exitCode = 0;
} else if (args.length === 1 && args[0] === "--dry-run") {
  process.exitCode = await run({ dryRun: true });
} else if (args.length === 1 && args[0] === "--yes") {
  process.exitCode = await run({ yes: true });
} else if (args.length > 0) {
  log.error("Unsupported command argument", { args });
  process.exitCode = 1;
}
