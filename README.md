# OE AI Training 2026

## Jira → n8n → TestRail (RPI)

### What it does
- Sends a Jira ID to the n8n webhook.
- Saves the plain-text response to disk for agent processing.
- The Copilot agent reads the saved file, parses test cases, and creates TestRail cases via MCP.

### Run locally
```bash
npm run jira:testrail -- --jira-id DTSYS-1234
```

### Environment
Defaults are provided in code. Override as needed:
- `N8N_WEBHOOK_URL`
- `N8N_OUTPUT_DIR`
- `TESTRAIL_PROJECT_ID`
- `TESTRAIL_SECTION_NAME`
- `TESTRAIL_TEMPLATE_NAME`
- `TESTRAIL_TYPE_NAME`
- `TESTRAIL_LABEL`

See [.env.example](.env.example).

### Notes
- The CLI only saves the n8n response; TestRail creation is done by the agent.
- Ensure MCP TestRail tools are available in the Copilot session for case creation.
- The agent uses DEFAULTS.sectionId and DEFAULTS.typeId from src/jira-to-testrail/types.js for selection.
- When creating cases, pass type_id using the DEFAULTS value.
- Always include custom_steps_separated mapped from parsed steps.

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

## Prompt strategy (authoritative + synced)

This repo uses a dual-location prompt strategy. Both locations are authoritative and must be kept in sync:
- [.github/prompts/start-project.prompt.md](.github/prompts/start-project.prompt.md)
- [.github/prompts/jira-testrail-rpi.prompt.md](.github/prompts/jira-testrail-rpi.prompt.md)
- [docs/prompts/start-project.prompt.md](docs/prompts/start-project.prompt.md)
- [docs/prompts/jira-testrail-rpi.prompt.md](docs/prompts/jira-testrail-rpi.prompt.md)

The prompts are written for Agent Mode and are intended to be executed inside VS Code by Copilot. They enforce deterministic edits, terminal execution, and explicit outputs.

### Prompt roles and how they work

#### 1) Start Project prompt
Purpose: scaffold and initialize a Playwright project with minimal structure and safe defaults.

Key behaviors:
- Creates the base folder structure and placeholder docs.
- Installs Playwright Test and browsers.
- Generates a minimal playwright.config.ts and a smoke test.

Use this when:
- Setting up a new repo or resetting a training workspace.

Authoritative prompt files:
- [.github/prompts/start-project.prompt.md](.github/prompts/start-project.prompt.md)
- [docs/prompts/start-project.prompt.md](docs/prompts/start-project.prompt.md)

#### 2) Jira → TestRail (RPI) prompt
Purpose: run the full RPI flow (Research → Plan → Implement) and then execute the Jira → n8n → TestRail pipeline.

Key behaviors:
- Treats the RPI artifacts as the source of truth.
- Runs the CLI to call n8n and save a response file.
- Parses the response and creates TestRail cases via MCP tools.

Use this when:
- You need to re-run the pipeline for a Jira ID (e.g., QAT-114).

Authoritative prompt files:
- [.github/prompts/jira-testrail-rpi.prompt.md](.github/prompts/jira-testrail-rpi.prompt.md)
- [docs/prompts/jira-testrail-rpi.prompt.md](docs/prompts/jira-testrail-rpi.prompt.md)

### RPI artifacts (source of truth)

These files define the exact parsing, mapping, and implementation rules. All prompts and agents must follow them:
- [docs/rpi/01-research.md](docs/rpi/01-research.md)
- [docs/rpi/02-plan.md](docs/rpi/02-plan.md)
- [docs/rpi/03-implement.md](docs/rpi/03-implement.md)

The system-level workflow instructions that generated the RPI artifacts live here:
- [docs/rpi/start-implementation.md](docs/rpi/start-implementation.md)

### Specialized agent

A dedicated case-creator agent reads saved n8n responses and creates TestRail cases via MCP:
- [.github/agents/jira-testrail.agent.md](.github/agents/jira-testrail.agent.md)

This agent:
- Reads data/n8n/{JIRA_ID}/{timestamp}/response.txt.
- Parses test cases using [docs/rpi/01-research.md](docs/rpi/01-research.md).
- Creates TestRail cases using the MCP TestRail tools.

### Prompts folder

The repo-level prompts folder is reserved for versioned prompt bundles and references:
- [prompts/README.md](prompts/README.md)

If you add new prompts here, ensure the authoritative prompt locations in .github/prompts and docs/prompts are updated in parallel.

## How to use the prompt workflow

### For contributors (editing prompts and docs)
1) Update both authoritative prompt locations in sync.
2) Validate changes against the RPI artifacts in [docs/rpi](docs/rpi).
3) Ensure the README stays accurate with any changes to prompt behavior.

### For prompt users (running the flow)
1) Run the Jira → TestRail prompt in Agent Mode with a Jira ID.
2) The CLI writes the newest response to data/n8n/{JIRA_ID}/{timestamp}/response.txt.
3) The agent reads the file, parses cases, and creates TestRail cases via MCP.
