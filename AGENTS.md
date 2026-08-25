# Agent guidance

`@eliware/translate` is a Node.js 26+ ESM CLI that translates Discord locale
files or command manifests with OpenAI. Run from the target repository root.

## Required validation

```text
npm test
npm run lint
npm audit --omit=dev --audit-level=moderate
npm pack --dry-run
```

`npm test` uses `@eliware/test` and must pass 100% statements, branches,
functions, and lines. `npm run lint` must produce zero warnings. Coverage does
not replace project-specific regression or integration checks.

CI runs these baseline gates on every `main` push, pull request, and `v*` tag
on Ubuntu and Windows. npm publication is tag-only and requires both platform
jobs to pass.

## Modes and safety

- Locale mode uses `en-US.json` and `prompt.json`.
- Command mode scans JSON command manifests and uses `prompt-commands.json`.
- `.env` and `OPENAI_API_KEY` are required at runtime; never commit them.
- Preserve ESM, focused modules, and tests for behavior changes.
- Translation overwrites generated output files; inspect changes before commit.
- Do not publish, push, tag, or release without explicit authorization.
