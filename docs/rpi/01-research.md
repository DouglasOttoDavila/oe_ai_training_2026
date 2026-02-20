# Research

## Problem statement and goal
We need a repeatable local flow that takes a Jira ID, sends it to an n8n webhook, parses the returned plain-text test cases, and creates all of them in TestRail using the MCP tool. The flow must preserve the test case meaning, map to the "Test Case (Steps)" template, and provide a CLI that exits non-zero if any failures occur.

## Inputs and outputs
### Input
- Jira ID (CLI arg): `{JIRA_ID}`
- n8n webhook: `https://n8n.objectedge.ai/webhook-test/analyze_jira_issue`
- JSON body:
  ```json
  {
    "jira_id": "{JIRA_ID}"
  }
  ```

### n8n response example
```json
[
  {
    "output": "Test Case Title: Login succeeds\nPreconditions:\n- User exists\nSteps:\n1. Go to login page\n2. Enter valid credentials\nExpected Results:\nUser is logged in\n---\nTest Case Title: Login fails\nSteps:\n1. Enter invalid credentials\nExpected Results:\nError message is shown"
  }
]
```

### Output
- Test cases created in TestRail:
  - Project: 25
  - Section: Demo Test
  - Template: Test Case (Steps)
  - Type: functional
  - References: `{JIRA_ID}`
  - Label: ai-generated-oe-training-2026
- CLI summary:
  - created / failed / skipped counts
  - non-zero exit if failures > 0

## Unknowns and assumptions
- Unknown: exact TestRail MCP tool names and payload schema. No local MCP config found; we will implement an adapter stub and document what needs wiring.
- Assumption: Node 18+ is available, so global `fetch` can be used without extra deps.
- Assumption: n8n returns a JSON array where each item has an `output` string.
- Assumption: The TestRail template supports steps with action + expected.

## Parsing approach for the output field
### Delimiter rules
- Test cases are separated by a line containing only `---` (optional surrounding whitespace).

### Field extraction rules
Headings are detected by lines like `Heading:` (case-insensitive). Supported headings:
- `Test Case Title:` or `Title:`
- `Preconditions:`
- `Test Data:`
- `Steps:`
- `Expected Results:` / `Expected Result:` / `Expected:`
- `References:`
- `Open Questions:`
- `Assumptions:`

### Steps extraction rules
- The `Steps:` section is split by lines.
- Numbered or bulleted lines (e.g. `1.`, `-`) are normalized to step actions.
- If a line includes `->`, `=>`, or `Expected:` the content is split into action and expected.

### Missing sections
- Missing title: generate `Untitled test case {n}` and log a warning.
- Missing steps with a provided expected block: create a single step with action `Execute scenario` and expected set to the block.
- Missing preconditions, test data, references, assumptions, open questions: treat as empty.

### Expected results handling
If expected results are provided as a block and not per-step, we will create a single step:
- action: `Execute scenario`
- expected: the expected results block
This keeps the meaning without guessing per-step expectations.

## TestRail mapping
- Title -> title
- Preconditions -> preconditions
- Steps block -> steps (structured)
- Expected results -> a single "Execute scenario" step when only a block exists
- References -> references (always set to `{JIRA_ID}`)
- Labels -> include `ai-generated-oe-training-2026`
- Type -> functional
- Template -> Test Case (Steps)
- Section -> Demo Test
- Project -> 25

## Execution strategy
- CLI command:
  - `npm run jira:testrail -- --jira-id {JIRA_ID}`
- Config via env vars with defaults:
  - `N8N_WEBHOOK_URL` (default to the provided URL)
  - `TESTRAIL_PROJECT_ID` (default 25)
  - `TESTRAIL_SECTION_NAME` (default Demo Test)
  - `TESTRAIL_TEMPLATE_NAME` (default Test Case (Steps))
  - `TESTRAIL_TYPE_NAME` (default functional)
  - `TESTRAIL_LABEL` (default ai-generated-oe-training-2026)

## Security notes
- Do not log secrets (API keys, credentials).
- Sanitize logged payloads: log counts and IDs, not full responses.
- Use explicit error messages without including sensitive response bodies.
