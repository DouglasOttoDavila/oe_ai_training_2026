# Implement

## What was built
- docs/rpi/01-research.md
- docs/rpi/02-plan.md
- docs/rpi/03-implement.md
- src/jira-to-testrail/types.js
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
- The agent uses DEFAULTS.sectionId and DEFAULTS.typeId from src/jira-to-testrail/types.js for selection.
- The agent sends custom_steps_separated for all cases.
