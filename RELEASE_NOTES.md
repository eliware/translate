# Release notes

## 1.1.6

- Updated translation model and package dependencies.
- Standardized the Node.js 26 CI workflow and added manual workflow dispatch.
- Adopted the shared `@eliware/test` testing toolkit.
- Added lint validation to CI and required Ubuntu and Windows checks before publication.
- Updated project conventions and shared agent guidance.
- Cleaned up obsolete Jest-result and AgentX ignore rules.
- Standardized baseline testing through `@eliware/test`.
- CI validates the baseline on Ubuntu and Windows before publication.
## Unreleased

- Upgraded the baseline test tooling to `@eliware/test` 2.x.
- Added standard audit and package dry-run gates to Ubuntu and Windows CI.
- Added pull-request CI coverage and retained tag-only publication gating.
- Refreshed agent guidance for the current conventions and safety rules.
## 2.0.0

### Changed

- Standardized the package on `@eliware/test` 2.x with strict 100×4 coverage
  and zero-warning linting.
- Added production audit and package dry-run gates to Ubuntu and Windows CI.
- Added pull-request validation and retained tag-only npm publication.
- Refreshed agent guidance and release documentation for the current
  conventions.

### Verification

- `npm test`: 100×4 coverage.
- `npm run lint`: 0 warnings.
- `npm audit --omit=dev --audit-level=moderate`: 0 vulnerabilities.
- `npm pack --dry-run`: passed.
