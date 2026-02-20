# Playwright Generation Conventions

## Scope
This document defines required conventions when generating Playwright tests from TestRail cases.

## File Layout
- Generated specs: `tests/generated/{case-id}.spec.ts`
- Page objects: `src/pages/*.page.ts`

## POM Requirement
- Page Object Model is mandatory for generated tests.
- Generated spec files must not contain large inline locator/action blocks that belong in page objects.
- If a page object does not exist, create one.
- If one exists, extend it instead of duplicating behavior.

## Locator Strategy
Use this priority order:
1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText` (exact or constrained)
5. CSS selector fallback only when necessary

Avoid brittle selectors based on deeply nested DOM structure.

## Assertion Strategy
- Assert at meaningful checkpoints tied to expected outcomes.
- Keep assertions focused and stable.
- On final step, assert the core success condition from the case.

## Test Naming
- `test.describe` title includes the case ID context.
- Each test title starts with `[Cxxxx]` where `xxxx` is the numeric TestRail case ID.

Example:
- `[C12345] User can submit contact form`

## Test Data + State
- Prefer deterministic inline fixtures in the test file for now.
- Do not introduce new global fixtures unless needed by multiple generated tests.
- Keep each generated case independently runnable.

## Execution
- Run each generated test immediately after writing:
  - `npx playwright test tests/generated/{case-id}.spec.ts`
- Capture pass/fail and first actionable error for reporting.

## Error Handling
- If generation succeeds but execution fails, keep files and mark case `failed` with reason.
- If a case cannot be translated (missing steps/context), create a minimal pending spec and mark `skipped` with rationale.

## Style Alignment
- Follow existing repo TypeScript/Playwright style.
- Keep changes minimal and case-focused.
- Do not refactor unrelated tests while generating per-case assets.
