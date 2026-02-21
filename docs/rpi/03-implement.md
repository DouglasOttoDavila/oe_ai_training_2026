# Implement

## What was built
- docs/rpi/01-research.md
- docs/rpi/02-plan.md
- docs/rpi/03-implement.md
- src/jira-to-testrail/n8n/n8nClient.js
- src/jira-to-testrail/index.js
- src/jira-to-testrail/cli.js
- .env.example
- README.md

## How to run locally
1. Install dependencies:
   - `npm install`
2. Run the CLI:
   - `npm run jira:testrail -- --jira-id DTSYS-1234`

## Reliability preflight (required)
1. Always run the CLI first for the active Jira ID before reading any prior output directories.
2. Verify fresh output exists at `data/n8n/{JIRA_ID}/{timestamp}/response.txt`.
3. Resolve config from `.env` keys (`TESTRAIL_SECTION_ID`, `TESTRAIL_TYPE_ID`, `TESTRAIL_TEMPLATE_ID` when needed).
4. In PowerShell/Windows shells, read env values using `Get-Item Env:<KEY>` style access.
5. Before each `add_case`, enforce payload allowlist only:
   - `section_id`
   - `title`
   - `type_id`
   - `refs`
   - `custom_steps_separated`
6. Always set `refs` to Jira ID only (for example `QAT-114`), never AC/FR tokens.
7. On timeout/ambiguous transport failures, perform verify-before-retry idempotency with max 2 retries and mark unresolved as `timeout_unconfirmed`.

## Example command invocation
```bash
npm run jira:testrail -- --jira-id {JIRA_ID}
```

## Example output
```text
{"level":"info","timestamp":"2026-02-20T00:00:00.000Z","message":"Posting Jira ID to n8n","jiraId":"DTSYS-1234","attempt":1}
{"level":"info","timestamp":"2026-02-20T00:00:00.000Z","message":"Saved n8n response","jiraId":"DTSYS-1234","filePath":"data/n8n/DTSYS-1234/2026-02-20T00-00-00-000Z/response.txt","length":5123}
```

## Known limitations / follow-ups
- TestRail MCP tool details are not available in this repo. The agent must call the real MCP tools.
- Dedupe is only available when MCP case-search tools are exposed.
- Parser rules are heuristic; expand if the n8n output format changes.
- The agent uses TestRail IDs from .env (TESTRAIL_SECTION_ID, TESTRAIL_TYPE_ID) for selection.
- The agent sends custom_steps_separated for all cases.
- Some MCP responses can be wrapped in validation/error envelopes; add normalization logic for idempotency checks before retrying.
