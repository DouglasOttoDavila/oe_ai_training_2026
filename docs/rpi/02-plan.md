# Plan

## Step-by-step plan with checkpoints
1. Create RPI artifacts with required sections and decisions.
   - Checkpoint: docs/rpi/01-research.md and docs/rpi/02-plan.md exist.
2. Implement n8n client and CLI orchestration.
  - Checkpoint: CLI validates input, handles HTTP errors/retries, and saves response files.
3. Define agent-driven parsing and TestRail creation.
  - Checkpoint: agent reads the saved response file and parses cases.
  - Checkpoint: agent calls MCP tools to create cases.
  - Checkpoint: agent uses TestRail IDs from .env (TESTRAIL_SECTION_ID, TESTRAIL_TYPE_ID).
  - Checkpoint: agent sends custom_steps_separated for all cases.
5. Add parser unit tests and npm scripts.
   - Checkpoint: `npm run test:parser` passes locally.
6. Document usage in README and .env.example.
   - Checkpoint: README contains “Jira → n8n → TestRail (RPI)” section.

## Data structures
- `ParsedTestCase`:
  - `title: string`
  - `preconditions?: string`
  - `testData?: string`
  - `steps: Array<{ action: string; expected: string }>`
  - `references?: string`
  - `assumptions?: string`
  - `openQuestions?: string`
  - `description?: string` (derived)
- `TestRailCasePayload`:
  - `title: string`
  - `preconditions?: string`
  - `testData?: string`
  - `steps: Array<{ action: string; expected: string }>`
  - `references: string`
  - `labels: string[]`
  - `type: string`
  - `template: string`
  - `description?: string`

## Error handling plan
- n8n HTTP failure:
  - Use timeouts and retry with exponential backoff (limited attempts).
  - Surface the last error with context (status, retry count).
- Invalid response format:
  - Throw a parse error; report failure and exit non-zero.
- Parsing failures (agent):
  - Record which chunk failed; continue parsing others; report failed count.
- TestRail creation failures (agent):
  - Continue with remaining cases; report failures in summary.
  - Exit non-zero if any failures occurred.

## Observability
- Structured logs using JSON lines (`level`, `message`, `jiraId`, `counts`).
- Summary report at end:
  - file path and length

## Implementation tasks list
- [ ] Create docs/rpi/01-research.md
- [ ] Create docs/rpi/02-plan.md
- [ ] Create docs/rpi/03-implement.md
- [ ] Add env config loader for TestRail defaults
- [ ] Add src/jira-to-testrail/n8n/n8nClient.js
- [ ] Add src/jira-to-testrail/index.js
- [ ] Add src/jira-to-testrail/cli.js
- [ ] Add .env.example
- [ ] Update package.json scripts
- [ ] Update README.md with RPI section

## Definition of Done
- CLI runs with `npm run jira:testrail -- --jira-id {JIRA_ID}`.
- Agent attempts creation of all parsed cases in TestRail.
- Agent parses all cases from the saved file.
- RPI artifacts and README section exist.
- Summary logs are emitted and non-zero exit on failures.
