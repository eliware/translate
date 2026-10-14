import { injectCommandJson } from "./prompt.mjs";

export async function runCommandMode({
  fsDep,
  pathDep,
  cwd,
  moduleDir,
  apiKey,
  translateLocaleDep,
  writeError,
}) {
  let names;
  try {
    names = (await fsDep.readdir(cwd)).filter((name) => name.endsWith(".json"));
  } catch {
    writeError("Failed to read current directory\n");
    return 1;
  }
  if (names.length === 0) {
    writeError("No .json files found — nothing to do\n");
    return 1;
  }
  const files = [];
  for (const name of names) {
    try {
      const raw = await fsDep.readFile(pathDep.join(cwd, name), "utf8");
      const data = JSON.parse(raw);
      if (typeof data.name === "string" && typeof data.type === "number") files.push({ name, raw });
    } catch {}
  }
  if (files.length === 0) {
    writeError("No command JSON manifests detected in this directory\n");
    return 1;
  }
  let prompt;
  try {
    prompt = JSON.parse(
      await fsDep.readFile(pathDep.join(moduleDir, "..", "prompt-commands.json"), "utf8"),
    );
  } catch {
    writeError("Failed to read or parse prompt-commands.json\n");
    return 1;
  }
  await Promise.all(
    files.map(async ({ name, raw }) => {
      try {
        const commandPrompt = JSON.parse(JSON.stringify(prompt));
        if (!injectCommandJson(commandPrompt, raw)) {
          writeError(`Could not inject command JSON into prompt for ${name}\n`);
          return;
        }
        const result = await translateLocaleDep({ locale: "", promptObj: commandPrompt, apiKey });
        let output = result;
        try {
          output = JSON.stringify(JSON.parse(result), null, 2);
        } catch {}
        await fsDep.writeFile(pathDep.join(cwd, name), output, "utf8");
      } catch {
        writeError(`Failed to translate command file ${name}\n`);
      }
    }),
  );
  return 0;
}
