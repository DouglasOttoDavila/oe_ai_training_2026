const { DEFAULTS } = require("./types");
const { postAnalyzeJiraIssue } = require("./n8n/n8nClient");
const { parseN8nOutputs } = require("./parsers/testcaseParser");
const { createTestrailMcpClient } = require("./testrail/testrailMcpClient");

const createLogger = () => {
  const log = (level, payload) => {
    const entry = {
      level,
      timestamp: new Date().toISOString(),
      ...payload
    };
    const writer = level === "error" ? console.error : console.log;
    writer(JSON.stringify(entry));
  };

  return {
    info: (payload) => log("info", payload),
    warn: (payload) => log("warn", payload),
    error: (payload) => log("error", payload)
  };
};

const runJiraToTestrail = async (options) => {
  const logger = options.logger || createLogger();
  const jiraId = options.jiraId;
  const dedupe = options.dedupe === true;

  const n8nWebhookUrl = options.n8nWebhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULTS.n8nWebhookUrl;
  const projectId = Number(options.projectId || process.env.TESTRAIL_PROJECT_ID || DEFAULTS.projectId);
  const sectionName = options.sectionName || process.env.TESTRAIL_SECTION_NAME || DEFAULTS.sectionName;
  const templateName = options.templateName || process.env.TESTRAIL_TEMPLATE_NAME || DEFAULTS.templateName;
  const typeName = options.typeName || process.env.TESTRAIL_TYPE_NAME || DEFAULTS.typeName;
  const label = options.label || process.env.TESTRAIL_LABEL || DEFAULTS.label;

  const n8nOutput = await postAnalyzeJiraIssue(jiraId, {
    n8nWebhookUrl,
    logger
  });

  const parsed = parseN8nOutputs(n8nOutput, { logger });
  if (parsed.errors.length > 0) {
    logger.warn({ message: "Parsing errors detected", errors: parsed.errors.length });
  }

  if (parsed.cases.length === 0) {
    throw new Error("No test cases parsed from n8n response");
  }

  const testrailClient = createTestrailMcpClient({ logger });

  if (dedupe) {
    const dedupeCheck = await testrailClient.findCasesByTitleAndReference();
    if (!dedupeCheck.supported) {
      logger.warn({
        message: "Dedupe requested but not supported by MCP adapter"
      });
    }
  }
  await testrailClient.findProject(projectId);
  const sectionId = await testrailClient.findOrCreateSection(projectId, sectionName);

  let created = 0;
  let failed = 0;
  let skipped = 0;

  for (const testCase of parsed.cases) {
    const casePayload = {
      title: testCase.title,
      preconditions: testCase.preconditions,
      testData: testCase.testData,
      steps: testCase.steps,
      references: jiraId,
      labels: [label],
      type: typeName,
      template: templateName,
      description: testCase.description
    };

    try {
      await testrailClient.addCase(projectId, sectionId, casePayload);
      created += 1;
    } catch (error) {
      failed += 1;
      logger.error({
        message: "Failed to create TestRail case",
        title: testCase.title,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const summary = { created, failed, skipped, total: parsed.cases.length };
  logger.info({ message: "Run summary", ...summary });

  return summary;
};

module.exports = {
  runJiraToTestrail,
  createLogger
};
