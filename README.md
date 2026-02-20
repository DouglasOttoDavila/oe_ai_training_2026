# OE AI Training 2026

## Jira → n8n → TestRail (RPI)

### What it does
- Sends a Jira ID to the n8n webhook.
- Parses plain-text test cases from the response.
- Creates all test cases in TestRail using the MCP adapter.

### Run locally
```bash
npm run jira:testrail -- --jira-id DTSYS-1234
```

### Environment
Defaults are provided in code. Override as needed:
- `N8N_WEBHOOK_URL`
- `TESTRAIL_PROJECT_ID`
- `TESTRAIL_SECTION_NAME`
- `TESTRAIL_TEMPLATE_NAME`
- `TESTRAIL_TYPE_NAME`
- `TESTRAIL_LABEL`

See [.env.example](.env.example).

### Notes
- The TestRail MCP adapter is a stub until MCP tool details are configured.
- The CLI exits non-zero if any test case creation fails.
