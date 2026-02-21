# .prompt.md — Scaffold Playwright Repo (Steps 2.1 → 2.3)
# Mode: Agent Mode (Copilot)
# Goal: Create a clean Playwright (JS/TS) project scaffold, install deps/browsers, add base folder structure, and generate a solid playwright.config.ts.
# Constraints:
# - Use Node.js 18+.
# - Use Playwright Test (@playwright/test).
# - Prefer TypeScript for config (playwright.config.ts) and tests (spec.ts).
# - Keep it minimal, readable, and consistent.
# - Do NOT add unrelated tooling (no Docker, no CI yet, no extra libs).
# - If files already exist, update them safely (don’t delete user content).
# - Every file created/edited must be listed at the end with a short reason.

## TASK
You are in a local workspace. Scaffold the repo according to the following steps:

### Step 2.1 — Scaffold Playwright (locally)
1) Ensure a Node project exists:
   - If package.json does not exist, run: `npm init -y`
2) Install Playwright Test as dev dependency:
   - `npm i -D @playwright/test`
3) Install browsers (with dependencies):
   - `npx playwright install --with-deps`

### Step 2.2 — Add a minimal structure
Create the following folders if they do not exist:
- /docs
- /docs/rpi
- /prompts
- /src
- /src/pages
- /src/utils
- /tests
- /workflows

Also add minimal placeholder files (only if missing):
- /docs/rpi/README.md (short note: “RPI artifacts live here.”)
- /prompts/README.md (short note: “Versioned prompts live here.”)
- /workflows/README.md (short note: “Exported n8n workflows live here.”)

### Step 2.3 — Add base Playwright config
Create or update `playwright.config.ts` with:
- testDir: "./tests"
- timeout: 30_000
- expect timeout: 5_000
- retries: 1
- reporter: list + html
- use:
  - headless: true
  - trace: "on-first-retry"
  - screenshot: "only-on-failure"
  - video: "retain-on-failure"
- projects:
  - chromium (default)
  - firefox
  - webkit
- outputDir for test results under: `./test-results`
- html report output under: `./playwright-report`
- baseURL: set from `process.env.BASE_URL` (from `.env`), with a safe fallback placeholder only when missing

Add npm scripts to package.json (create if missing):
- "test": "playwright test"
- "test:ui": "playwright test --ui"
- "test:report": "playwright show-report"
- "test:debug": "playwright test --debug"

Create a sample smoke test if none exists:
- `tests/smoke.spec.ts`
  - Contains a simple test that visits baseURL (or a placeholder URL) and asserts something safe (e.g., page has a title).
  - Must not depend on a specific external site requiring credentials.

## EXECUTION RULES (IMPORTANT)
- You MUST actually run the terminal commands where applicable (npm install, playwright install).
- Prefer deterministic edits: show diffs or clearly describe what changed.
- Keep everything minimal—no extra frameworks, no linting, no prettier, no Husky.
- Ensure the project runs `npm test` without errors (if there is no app at baseURL, the smoke test should not hard-fail; handle gracefully by using `page.setContent()` to assert something, OR use a robust check that doesn't require a live server).

## OUTPUT FORMAT
1) A short summary of actions taken.
2) Terminal commands executed (with results).
3) Files created/updated (bullet list with short reason).
4) Next step suggestion: “Run npm test” and what to expect.