# Agent Workflow Constraints — TestRail -> Vibium -> Playwright

## Goal
Define the mandatory execution contract for generating and validating Playwright tests from existing TestRail case IDs.

## Accepted Inputs
- `caseIds`: explicit list of TestRail case IDs (manual entry).
- `sourceInteractionRef`: reference to a previous interaction output that already contains generated case IDs.

If both are provided, `caseIds` takes precedence.

## Required Per-Case Loop
For each case ID, execute in order:
1. Fetch TestRail case details using MCP `get_case`.
2. Normalize the case into a canonical execution model:
   - `title`
   - `preconditions`
   - `steps[]` with `action`, `expected`
   - `priority` and relevant metadata
3. Reproduce the scenario with Vibium MCP tools:
   - navigate to target URL
   - perform interactions required by the case steps (click/type/select/assert)
   - capture screenshots on meaningful checkpoints and on failure
4. Generate or update Playwright assets following repository conventions:
   - create/update page objects in `src/pages`
   - create/update spec file in `tests/generated`
5. Run the generated test to verify the script executes.
6. Persist a per-case result record and continue to the next case.

## Continuation Policy
- Default mode is continue-on-failure.
- A failed case must not block processing remaining case IDs.
- Final output must include passed/failed/skipped counts and case-level reasons.

## Output Contract
At completion, return:
- Execution summary (`total`, `passed`, `failed`, `skipped`)
- Per-case results containing:
  - case ID
  - generated files
  - execution status
  - concise failure reason (if any)
  - evidence references (screenshots/logs)

## Safety + Reliability Rules
- Do not log secrets, session tokens, or private payloads.
- Do not copy full TestRail raw payloads into output; include only required fields.
- Avoid brittle selectors; prefer role/label/text strategies before CSS fallback.
- Keep retries minimal and deterministic.

## MCP Tool Availability
If required MCP tools are unavailable, stop with a clear missing-tools report:
- TestRail case retrieval (must support `get_case`)
- Vibium browser session/navigation/interaction tools

## Naming Conventions
- Generated spec path: `tests/generated/{case-id}.spec.ts`
- Generated page objects: `src/pages/{feature-or-page}.page.ts`

## Batch Determinism
- Process IDs in the exact provided order.
- Do not silently reorder or deduplicate unless instructed.
- If a duplicate ID exists, process each occurrence and report duplicates.
