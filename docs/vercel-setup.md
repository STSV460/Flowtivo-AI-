# Verified Vercel agent setup

Checked 9 November 2026 using the owner's requested [Vercel setup playbook](https://vercel.com/get-started.md).

- CLI: Vercel 65.12.1, installed globally under `/opt/homebrew`, available as `vercel`.
- CLI authentication: `stsv460`; intended team `stsv460s-projects`.
- Guidance: existing Vercel plugin skills available in Codex; no duplicate standalone pack installed.
- MCP: official shared endpoint `https://mcp.vercel.com`, existing global Codex configuration retained in `~/.codex/config.toml`.
- MCP authentication: completed through `codex mcp login vercel`. The owner approved the team's access separately.
- Authenticated checks: documentation search, team retrieval and `list_teams` succeeded for the intended team. No client reload was needed after the tools refreshed.
- Mutations: no project, production deployment, production environment variables, billing upgrade or domain/DNS change was created during these checks. Existing confirmation settings were not weakened.

The owner explicitly selected **“Finish checks; hold deployment.”** Keep that hold until a later instruction. The team currently uses Hobby; Vercel's [commercial-use policy](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage) requires Pro or Enterprise for an agency service website. No purchase was authorized or made.

The application has Vercel source configuration and a serverless contact handler ready for later validation with a linked project. Runtime deployment, real production SMTP delivery, DNS, TLS, redirect behavior and live indexing have not been verified. Those require the deployment to proceed.
