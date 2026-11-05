#!/usr/bin/env node
import { log, registerHandlers, registerSignals } from "@eliware/common";
import packageData from "../package.json" with { type: "json" };
import { parseArgs } from "../src/cli/args.mjs";
import { runTranslate } from "../src/main.mjs";

const args = process.argv.slice(2);
async function run(options) {
  const errorHandlers = registerHandlers();
  const signalHandlers = registerSignals({
    shutdownHook: () => errorHandlers.removeHandlers(),
  });
  try {
    return await runTranslate({
      ...options,
      writeInfo: (message) => process.stdout.write(message),
      writeDebug: (message) => process.stderr.write(message),
    });
  } catch (error) {
    log.error("Translation failed", { error });
    if (options.debug) process.stderr.write(`Debug: ${error.message}\n`);
    return 1;
  } finally {
    errorHandlers.removeHandlers();
    signalHandlers.removeHandlers();
  }
}

if (args.length === 0 || (args.length === 1 && args[0] === "--help")) {
  process.stdout.write(
    "Usage: translate [--yes | --dry-run] [--file <path>] [--debug]\nTranslate locale files or command manifests.\n",
  );
  process.stdout.write(
    "Use --file to select one command manifest. Use --dry-run to list target files.\n",
  );
  process.stdout.write(
    "Use --yes to send requests and write files. Add --debug to show error details.\n",
  );
  process.exitCode = 0;
} else if (args.length === 1 && args[0] === "--version") {
  process.stdout.write(`${packageData.version}\n`);
  process.exitCode = 0;
} else {
  const { options, error } = parseArgs(args);
  if (error) {
    log.error(error);
    process.exitCode = 1;
  } else {
    process.exitCode = await run(options);
  }
}
