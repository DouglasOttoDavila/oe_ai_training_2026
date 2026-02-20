# Research

## Problem statement and goal
We need a repeatable local flow that takes a Jira ID, sends it to an n8n webhook, stores the returned plain-text test cases to disk, and then uses a Copilot agent to read that file and create all of them in TestRail using MCP tools. The flow must preserve the test case meaning, map to the "Test Case (Steps)" template, and provide a CLI that exits non-zero if any failures occur while fetching or saving the response.

## Inputs and outputs
### Input
- Jira ID (CLI arg): `{JIRA_ID}`
- n8n webhook: `https://n8n.objectedge.ai/webhook/analyze_jira_issue`
- JSON body:
  ```json
  {
    "jira_id": "{JIRA_ID}"
  }
  ```

### n8n response example
```text
Test Case Title: Login succeeds
Preconditions:
- User exists
Steps:
1. Go to login page
2. Enter valid credentials
Expected Results:
User is logged in
---
Test Case Title: Login fails
Steps:
1. Enter invalid credentials
Expected Results:
Error message is shown
```

### Output
- Saved n8n response file:
  - Folder: `data/n8n/{JIRA_ID}/{timestamp}/response.txt`
- Agent-created test cases in TestRail:
  - Project: 25
  - Section: AI-Generated TCs
  - Section ID: from .env (TESTRAIL_SECTION_ID)
  - Template: Test Case (Steps)
  - Template ID: from .env (TESTRAIL_TEMPLATE_ID)
  - Type: functional
  - Type ID: from .env (TESTRAIL_TYPE_ID)
  - References: `{JIRA_ID}`
  - Label: ai-generated-oe-training-2026
- CLI summary:
  - file path and length
  - non-zero exit if fetch/save fails

## Unknowns and assumptions
- Unknown: exact TestRail MCP tool names and payload schema. The agent must call the available MCP tools directly.
- Assumption: Node 18+ is available, so global `fetch` can be used without extra deps.
- Assumption: n8n returns a plain-text response containing all test cases.
- Assumption: The TestRail template supports steps with action + expected.

## Agent parsing approach for the output field
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

### Steps extraction rules (agent)
- The `Steps:` section is split by lines.
- Numbered or bulleted lines (e.g. `1.`, `-`) are normalized to step actions.
- If a line includes `->`, `=>`, or `Expected:` the content is split into action and expected.

### Missing sections (agent)
- Missing title: generate `Untitled test case {n}` and log a warning.
- Missing steps with a provided expected block: create a single step with action `Execute scenario` and expected set to the block.
- Missing preconditions, test data, references, assumptions, open questions: treat as empty.

### Expected results handling
If expected results are provided as a block and not per-step, we will create a single step only when no explicit steps are present:
- action: `Execute scenario`
- expected: the expected results block
This keeps the meaning without guessing per-step expectations.

## TestRail mapping
- Title -> title
- Preconditions -> preconditions
- Steps block -> steps (structured)
- custom_steps_separated -> map step.action to content and step.expected to expected
- Expected results -> a single "Execute scenario" step when only a block exists
- References -> references (always set to `{JIRA_ID}`)
- Labels -> include `ai-generated-oe-training-2026`
- Section ID -> TESTRAIL_SECTION_ID
- Template ID -> TESTRAIL_TEMPLATE_ID
- Type ID -> TESTRAIL_TYPE_ID
- Type -> functional
- Template -> Test Case (Steps)
- Section -> AI-Generated TCs
- Project -> 25

Example custom_steps_separated payload:
```json
[
  {
    "content": "Go to login page",
    "expected": "Login page is displayed"
  },
  {
    "content": "Enter valid credentials",
    "expected": "User is logged in"
  }
]
```

## Execution strategy
- CLI command:
  - `npm run jira:testrail -- --jira-id {JIRA_ID}`
- Config via env vars with defaults:
  - `N8N_WEBHOOK_URL` (default to the provided URL)
  - `N8N_OUTPUT_DIR` (default `data/n8n`)
  - `TESTRAIL_PROJECT_ID` (default 25)
  - `TESTRAIL_SECTION_NAME` (default Demo Test)
  - `TESTRAIL_SECTION_ID` (default: optional, prefer explicit ID when provided)
  - `TESTRAIL_TEMPLATE_NAME` (default Test Case (Steps))
  - `TESTRAIL_TEMPLATE_ID` (default: optional, prefer explicit ID when provided)
  - `TESTRAIL_TYPE_NAME` (default functional)
  - `TESTRAIL_TYPE_ID` (default: optional, prefer explicit ID when provided)
  - `TESTRAIL_LABEL` (default ai-generated-oe-training-2026)

## Security notes
- Do not log secrets (API keys, credentials).
- Sanitize logged payloads: log counts and IDs, not full responses.
- Use explicit error messages without including sensitive response bodies.
