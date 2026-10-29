import { injectCommandJson, loadCommandPrompt } from "../prompts/command-prompt.mjs";
import { findCommandFiles } from "./files.mjs";
import { formatCommandResponse } from "./response.mjs";
import { writeDebugError } from "../cli-error.mjs";

export async function runCommandMode({
  fsDep,
  pathDep,
  cwd,
  moduleDir,
  apiKey,
  translateLocaleDep,
  writeError,
  dryRun = false,
  writeInfo = () => {},
  debug = false,
  writeDebug = () => {},
  file,
}) {
  let names, files, invalidFiles;
  try {
    ({ names, files, invalidFiles } = await findCommandFiles({ fsDep, pathDep, cwd, file }));
  } catch (error) {
    writeError("Failed to read current directory\n");
    writeDebugError({ debug, writeDebug, context: "current directory", error });
    return 1;
  }
  if (names.length === 0) {
    writeError("No .json files found — nothing to do\n");
    return 1;
  }
  for (const { name, error } of invalidFiles) {
    writeError(`Could not read or parse JSON file ${name}\n`);
    writeDebugError({ debug, writeDebug, context: name, error });
  }
  if (files.length === 0) {
    writeError("No command JSON manifests detected in this directory\n");
    return 1;
  }
  if (dryRun) {
    for (const { name } of files) writeInfo(`Target file: ${name}\n`);
    return invalidFiles.length > 0 ? 1 : 0;
  }
  let prompt;
  try {
    prompt = await loadCommandPrompt({ fsDep, pathDep, moduleDir });
  } catch (error) {
    writeError("Failed to read or parse prompt-commands.json\n");
    writeDebugError({ debug, writeDebug, context: "prompt-commands.json", error });
    return 1;
  }
  let failed = invalidFiles.length > 0;
  await Promise.all(
    files.map(async ({ name, filePath, raw }) => {
      try {
        const commandPrompt = JSON.parse(JSON.stringify(prompt));
        if (!injectCommandJson(commandPrompt, raw)) {
          failed = true;
          writeError(`Could not inject command JSON into prompt for ${name}\n`);
          return;
        }
        const result = await translateLocaleDep({ locale: "", promptObj: commandPrompt, apiKey });
        let output;
        try {
          output = formatCommandResponse(result, JSON.parse(raw));
        } catch (error) {
          failed = true;
          writeError(`Invalid command response for command file ${name}\n`);
          writeDebugError({ debug, writeDebug, context: name, error });
          return;
        }
        await fsDep.writeFile(filePath, output, "utf8");
      } catch (error) {
        failed = true;
        writeError(`Failed to translate command file ${name}\n`);
        writeDebugError({ debug, writeDebug, context: name, error });
      }
    }),
  );
  return failed ? 1 : 0;
}
