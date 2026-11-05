const helpOutput =
  "Usage: translate [--yes | --dry-run] [--file <path>] [--debug]\n" +
  "Translate locale files or command manifests.\n" +
  "Use --file to select one command manifest. Use --dry-run to list target files.\n" +
  "Use --yes to send requests and write files. Add --debug to show error details.\n";

export function getInformationalOutput(args, version) {
  if (args.length === 0 || (args.length === 1 && args[0] === "--help")) {
    return helpOutput;
  }
  if (args.length === 1 && args[0] === "--version") return `${version}\n`;
  return null;
}
