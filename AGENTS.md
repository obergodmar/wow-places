# Development

- Next.js/React application; preserve the existing product interface and local media.
- Use the generated `wow-*` commands inside devenv; root package scripts are authoritative.
- Existing JS/TS style uses 4 spaces. Preserve it; new-project defaults do not migrate this repository.
- Run `wow-check` and `wow-build` before handing off application changes; run relevant browser tests when behavior changes.
- Vercel is the existing deployment target. Hosting changes and live deployments require the user's chosen scope.

- Shared tooling workflows come from the Agent Workflows Codex plugin declared in `.agents/plugins/marketplace.json`; project decisions remain authoritative.
- Preserve existing tool versions/style. Every maintained project has EditorConfig and appropriate format, lint, and type checks; new JS/TS projects default to 2 spaces, Oxfmt, Oxlint, and TypeScript.
- Apply the plugin's relevant workflow when changing tooling, quality gates, or deployment. Reuse accepted standards; discuss architecture, hosting, databases, and persistence changes with the user.
- For personal-host operations, use only the infrastructure checkout explicitly selected by the user for that operation. Never infer it from folder names or a conventional home path.
