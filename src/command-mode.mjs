import { injectCommandJson, loadCommandPrompt } from "./prompts/command-prompt.mjs";
import { findCommandFiles } from "./command-files.mjs";
import { formatCommandResponse } from "./command-response.mjs";

export async function runCommandMode({
  fsDep,
  pathDep,
  cwd,
  moduleDir,
  apiKey,
  translateLocaleDep,
  writeError,
}) {
  let names, files, invalidFiles;
  try {
    ({ names, files, invalidFiles } = await findCommandFiles({ fsDep, pathDep, cwd }));
  } catch {
    writeError("Failed to read current directory\n");
    return 1;
  }
  if (names.length === 0) {
    writeError("No .json files found — nothing to do\n");
    return 1;
  }
  for (const name of invalidFiles) writeError(`Could not read or parse JSON file ${name}\n`);
  if (files.length === 0) {
    writeError("No command JSON manifests detected in this directory\n");
    return 1;
  }
  let prompt;
  try {
    prompt = await loadCommandPrompt({ fsDep, pathDep, moduleDir });
  } catch {
    writeError("Failed to read or parse prompt-commands.json\n");
    return 1;
  }
  let failed = invalidFiles.length > 0;
  await Promise.all(
    files.map(async ({ name, raw }) => {
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
        } catch {
          failed = true;
          writeError(`Invalid JSON response for command file ${name}\n`);
          return;
        }
        await fsDep.writeFile(pathDep.join(cwd, name), output, "utf8");
      } catch {
        failed = true;
        writeError(`Failed to translate command file ${name}\n`);
      }
    }),
  );
  return failed ? 1 : 0;
}
