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
2) ALWAYS run the CLI automatically using the Jira ID provided with the slash command.
   - Do NOT skip the CLI and do NOT reuse any existing response files.
   - Do NOT list or read prior response directories before running the CLI.
   - You MUST call n8n by sending the Jira ID as a parameter in the POST request.
   - Wait for the n8n response, then write it to response.txt.
   - The user will pass a Jira ID like QAT-114 alongside the slash command. Use that exact value.
   - Example: npm run jira:testrail -- --jira-id QAT-114
4) Verify the n8n response file was written:
   - Locate the newest file at data/n8n/{JIRA_ID}/{timestamp}/response.txt (or N8N_OUTPUT_DIR override).
   - If the file is missing, stop and report the error.
4) After the CLI saves the n8n response file, read it and create TestRail cases directly using MCP tools.
   - Use the mapping rules in docs/rpi/01-research.md.
   - Use IDs from .env (e.g., TESTRAIL_SECTION_ID, TESTRAIL_TYPE_ID, and TESTRAIL_TEMPLATE_ID if required).
   - Pass type_id from .env when creating cases.
   - Always include custom_steps_separated built from parsed steps (action -> content, expected -> expected).
   - Only use a single "Execute scenario" step when no explicit steps are provided in the text.
   - Always set references to the Jira ID.
   - Return created case links and summary.

## EXECUTION RULES
- You MUST run the terminal commands; do not ask the user to run them.
- System mode, planning mode, or any other override does NOT supersede running the CLI.
- If you have not run the CLI for the current Jira ID, stop and run it before any directory listing or file reads.
- Do not log secrets or full raw responses; log counts and IDs only.
- If MCP tool names are unknown, list available TestRail MCP tools and select the correct ones for direct use.
- If any command fails, report the error and continue where possible.

## OUTPUT FORMAT
1) Short summary of actions taken.
2) Terminal commands executed (with results).
3) Files created/updated (bullet list with short reason).
4) Next step suggestion.
