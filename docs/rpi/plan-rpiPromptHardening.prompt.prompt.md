## Plan: Harden RPI Prompts Against Session Failures

This plan updates the prompt/doc source-of-truth so the same errors do not recur: invalid TestRail refs payloads, duplicate case creation after timeouts, parser drift on step-level expected results, accidental parsing of appendix sections, and brittle selector behavior during generated Playwright execution. It applies your chosen decisions: `refs` must be Jira-only, `add_case` timeout handling must be verify-before-retry, and Vibium unavailability must fallback to Playwright-only reproduction. The plan keeps mirrored prompt files synchronized and resolves current rule conflicts between workflow docs and agent cards.

**Steps**
1. Update Jira→TestRail execution rules in [.github/prompts/jira-testrail-rpi.prompt.md](.github/prompts/jira-testrail-rpi.prompt.md) to enforce:
   - `refs` normalization to Jira key only
   - verify-before-retry idempotency for `add_case` timeouts
   - bounded concurrency/retry guidance
   - explicit appendix exclusion (`Coverage Map`, `Open Questions`, `Assumptions`) before case parsing.
2. Mirror the same behavior in [docs/prompts/jira-testrail-rpi.prompt.md](docs/prompts/jira-testrail-rpi.prompt.md) to keep prompt parity.
3. Tighten parsing contract in [docs/rpi/01-research.md](docs/rpi/01-research.md):
   - disambiguate top-level section heading vs step-level `Expected Results`
   - define deterministic cutoff/ignore for non-case appendix blocks
   - document Jira-only `refs` sanitization.
4. Resolve workflow conflict in [docs/rpi/04-agent-workflow-constraints.md](docs/rpi/04-agent-workflow-constraints.md):
   - replace “missing Vibium tools => hard stop” with fallback matrix
   - define fallback evidence labeling when running Playwright-only reproduction.
5. Strengthen selector robustness in [docs/rpi/05-playwright-generation-conventions.md](docs/rpi/05-playwright-generation-conventions.md):
   - require first-visible selection among multiple matches
   - require link/button variant handling for responsive nav controls
   - prohibit blind `.first()` on role queries when hidden duplicates are common.
6. Update Vibium→Playwright operational prompt in [.github/prompts/testrail-vibium-playwright-rpi.prompt.md](.github/prompts/testrail-vibium-playwright-rpi.prompt.md) with fallback behavior and selector resilience checks.
7. Mirror step 6 in [docs/prompts/testrail-vibium-playwright-rpi.prompt.md](docs/prompts/testrail-vibium-playwright-rpi.prompt.md).
8. Align agent-card behavior in [.github/agents/jira-testrail.agent.md](.github/agents/jira-testrail.agent.md) with the updated refs/idempotency/source-of-truth rules to eliminate contradictory instructions.

**Verification**
- Cross-file consistency check: `refs` rule text, timeout retry rule text, and Vibium fallback rule text match across both `.github/prompts/*` and `docs/prompts/*`.
- Search assertions:
  - `refs` examples only show Jira key format
  - `add_case timeout` includes verify-before-retry
  - appendix markers are explicitly excluded from case parsing
  - fallback wording appears in both workflow constraints and vibium prompt.
- Dry-run prompt validation: ensure no instruction conflicts remain between [docs/rpi/04-agent-workflow-constraints.md](docs/rpi/04-agent-workflow-constraints.md) and [.github/prompts/testrail-vibium-playwright-rpi.prompt.md](.github/prompts/testrail-vibium-playwright-rpi.prompt.md).

**Decisions**
- Refs: Jira ID only.
- Timeout handling: verify-before-retry.
- Vibium unavailable: fallback to Playwright-only reproduction.

I’m ready to hand this off for implementation now.
