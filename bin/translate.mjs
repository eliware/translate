#!/usr/bin/env node
import { log, registerHandlers, registerSignals } from "@eliware/common";
import packageData from "../package.json" with { type: "json" };
import { parseArgs } from "../src/cli/args.mjs";
import { getInformationalOutput } from "../src/cli/informational.mjs";
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

const informationalOutput = getInformationalOutput(args, packageData.version);
if (informationalOutput !== null) {
  process.stdout.write(informationalOutput);
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
