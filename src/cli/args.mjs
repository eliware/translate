export function parseArgs(values) {
  const options = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--yes") options.yes = true;
    else if (value === "--dry-run") options.dryRun = true;
    else if (value === "--debug") options.debug = true;
    else if (value === "--file") {
      const file = values[index + 1];
      if (!file || file.startsWith("--")) return { error: "Add a file path after --file." };
      options.commandFile = file;
      index += 1;
    } else {
      return { error: `Unsupported command argument: ${value}` };
    }
  }
  return { options };
}
