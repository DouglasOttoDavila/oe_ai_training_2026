const { DEFAULTS } = require("../types");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const postAnalyzeJiraIssue = async (jiraId, options = {}) => {
  const url = options.n8nWebhookUrl || DEFAULTS.n8nWebhookUrl;
  const timeoutMs = options.timeoutMs || 20000;
  const retries = options.retries ?? 2;
  const logger = options.logger;

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (logger) {
        logger.info({
          message: "Posting Jira ID to n8n",
          jiraId,
          attempt: attempt + 1
        });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ jira_id: jiraId }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`n8n responded with status ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("n8n response is not an array");
      }

      return data;
    } catch (error) {
      lastError = error;
      if (logger) {
        logger.warn({
          message: "n8n request failed",
          attempt: attempt + 1,
          error: error instanceof Error ? error.message : String(error)
        });
      }

      if (attempt < retries) {
        const backoff = 500 * Math.pow(2, attempt);
        await sleep(backoff);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("n8n request failed");
};

module.exports = {
  postAnalyzeJiraIssue
};
