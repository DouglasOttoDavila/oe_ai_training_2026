# .prompt.md — TestRail Single Case Debug (Vibium + Playwright)
# Mode: Agent Mode (Copilot)
# Goal: Reproduce one TestRail case end-to-end, generate/adjust Playwright POM test, and validate execution.

## SOURCE OF TRUTH
- docs/rpi/04-agent-workflow-constraints.md
- docs/rpi/05-playwright-generation-conventions.md

## INPUT
- `caseId`: one TestRail case ID

## TASK
1) Fetch case with MCP `get_case`.
2) Reproduce steps with Vibium MCP and identify mismatch points.
3) Create/update page object(s) in `src/pages`.
4) Create/update test file `tests/generated/{case-id}-{readable-kebab-title}.spec.ts`.
	- Use proper Playwright test structure (`test.describe` / `test`), not generic step-runner wrappers.
5) Run the generated test and collect concrete failure output if it fails.

## OUTPUT FORMAT
1) Summary of case execution.
2) Files changed.
3) Test run result.
4) If failed: root cause and exact next fix action.
