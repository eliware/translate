import { isCommandManifest } from "./manifest.mjs";

export async function readCommandManifest({ fsDep, name, filePath }) {
  try {
    const raw = await fsDep.readFile(filePath, "utf8");
    const data = JSON.parse(raw);
    if (!isCommandManifest(data)) return { invalidManifest: true };
    return { file: { name, filePath, raw } };
  } catch (error) {
    return {
      invalidFile: {
        name,
        error: error instanceof SyntaxError ? new Error("File is not valid JSON") : error,
      },
    };
  }
}
