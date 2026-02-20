# Implement

## What was built
- docs/rpi/01-research.md
- docs/rpi/02-plan.md
- docs/rpi/03-implement.md
- src/jira-to-testrail/types.js
- src/jira-to-testrail/parsers/testcaseParser.js
- src/jira-to-testrail/parsers/testcaseParser.test.js
- src/jira-to-testrail/n8n/n8nClient.js
- src/jira-to-testrail/testrail/testrailMcpClient.js
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
{"level":"warn","timestamp":"2026-02-20T00:00:00.000Z","message":"Parsing errors detected","errors":0}
{"level":"error","timestamp":"2026-02-20T00:00:00.000Z","message":"Failed to create TestRail case","title":"Login succeeds","error":"TestRail MCP tool is not configured. Wire MCP tool calls in testrailMcpClient.js."}
{"level":"info","timestamp":"2026-02-20T00:00:00.000Z","message":"Run summary","created":0,"failed":1,"skipped":0,"total":1}
```

## Known limitations / follow-ups
- TestRail MCP tool details are not available in this repo. The adapter must be wired to the real MCP calls.
- Dedupe is not implemented because the MCP search capability is unknown.
- Parser rules are heuristic; expand if the n8n output format changes.
