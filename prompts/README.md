# Prompts

Versioned prompts live here.

## Authoritative prompt index
- [.github/prompts/01-start-project.prompt.md](../.github/prompts/01-start-project.prompt.md)
	- Agent: Built-in default (no custom agent selection)
- [.github/prompts/02-jira-testrail-rpi.prompt.md](../.github/prompts/02-jira-testrail-rpi.prompt.md)
	- Agent: [.github/agents/jira-testrail.agent.md](../.github/agents/jira-testrail.agent.md)
- [.github/prompts/04-testrail-vibium-playwright-rpi.prompt.md](../.github/prompts/04-testrail-vibium-playwright-rpi.prompt.md)
	- Agent: [.github/agents/testrail-vibium-playwright.agent.md](../.github/agents/testrail-vibium-playwright.agent.md)
- [.github/prompts/03-testrail-single-case-debug.prompt.md](../.github/prompts/03-testrail-single-case-debug.prompt.md)
	- Agent: [.github/agents/testrail-vibium-playwright.agent.md](../.github/agents/testrail-vibium-playwright.agent.md)

## Global reliability constraints
- For Jira -> n8n -> TestRail runs, follow strict controls in:
	- [docs/rpi/01-research.md](../docs/rpi/01-research.md)
	- [docs/rpi/02-plan.md](../docs/rpi/02-plan.md)
	- [docs/rpi/03-implement.md](../docs/rpi/03-implement.md)
- These controls include fresh CLI-first execution, appendix exclusion, payload allowlist safety, verify-before-retry idempotency, Jira-only refs, and safe logging.
