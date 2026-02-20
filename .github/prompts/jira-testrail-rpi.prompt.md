# .prompt.md — Jira to TestRail (RPI)
# Mode: Agent Mode (Copilot)
# Goal: Execute the full RPI flow for Jira -> n8n -> TestRail using the existing docs and code, and run commands automatically.

## SOURCE OF TRUTH
Use these files as authoritative requirements:
- docs/rpi/01-research.md
- docs/rpi/02-plan.md
- docs/rpi/03-implement.md

## TASK
1) Read the RPI docs above and verify the implementation matches them.
2) Wire the TestRail MCP adapter to real MCP tools available in THIS session:
   - Find the exact tool names (for example: get_case, get_cases, add_case, get_project, get_projects, add_section).
   - Update src/jira-to-testrail/testrail/testrailMcpClient.js accordingly.
   - Ensure findProject, findOrCreateSection, and addCase use MCP tools.
   - If dedupe is supported, implement it using title + references; otherwise log a warning and continue.
3) Run the parser tests automatically:
   - npm run test:parser
4) Run the CLI automatically with a sample Jira ID:
   - npm run jira:testrail -- --jira-id DTSYS-1234

## EXECUTION RULES
- You MUST run the terminal commands; do not ask the user to run them.
- Do not log secrets or full raw responses; log counts and IDs only.
- If MCP tool names are unknown, list available TestRail MCP tools and select the correct ones, then wire the adapter.
- If any command fails, report the error and continue where possible.

## OUTPUT FORMAT
1) Short summary of actions taken.
2) Terminal commands executed (with results).
3) Files created/updated (bullet list with short reason).
4) Next step suggestion.
