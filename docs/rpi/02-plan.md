# Plan

## Step-by-step plan with checkpoints
1. Create RPI artifacts with required sections and decisions.
   - Checkpoint: docs/rpi/01-research.md and docs/rpi/02-plan.md exist.
2. Implement parsing logic and types.
   - Checkpoint: parser returns structured cases from a sample output.
3. Implement n8n client and CLI orchestration.
   - Checkpoint: CLI validates input and handles HTTP errors/retries.
4. Implement TestRail MCP adapter stub.
   - Checkpoint: adapter exposes required methods and documents wiring needs.
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
- Invalid JSON:
  - Throw a parse error; report failure and exit non-zero.
- Parsing failures:
  - Record which chunk failed; continue parsing others; report failed count.
- TestRail creation failures:
  - Continue with remaining cases; report failures in summary.
  - Exit non-zero if any failures occurred.

## Observability
- Structured logs using JSON lines (`level`, `message`, `jiraId`, `counts`).
- Summary report at end:
  - created count
  - failed count
  - skipped count (must be 0 unless dedupe is enabled)

## Implementation tasks list
- [ ] Create docs/rpi/01-research.md
- [ ] Create docs/rpi/02-plan.md
- [ ] Create docs/rpi/03-implement.md
- [ ] Add src/jira-to-testrail/types.js
- [ ] Add src/jira-to-testrail/parsers/testcaseParser.js
- [ ] Add src/jira-to-testrail/parsers/testcaseParser.test.js
- [ ] Add src/jira-to-testrail/n8n/n8nClient.js
- [ ] Add src/jira-to-testrail/testrail/testrailMcpClient.js
- [ ] Add src/jira-to-testrail/index.js
- [ ] Add src/jira-to-testrail/cli.js
- [ ] Add .env.example
- [ ] Update package.json scripts
- [ ] Update README.md with RPI section

## Definition of Done
- CLI runs with `npm run jira:testrail -- --jira-id {JIRA_ID}`.
- All parsed cases are attempted for creation in TestRail.
- Parser tests pass.
- RPI artifacts and README section exist.
- Summary logs are emitted and non-zero exit on failures.
