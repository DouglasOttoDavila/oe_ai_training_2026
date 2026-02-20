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
