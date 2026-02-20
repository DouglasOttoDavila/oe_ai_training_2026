const { DEFAULTS } = require("../types");

const createTestrailMcpClient = (options = {}) => {
  const logger = options.logger;

  const notConfiguredError = () => new Error(
    "TestRail MCP tool is not configured. Wire MCP tool calls in testrailMcpClient.js."
  );

  return {
    async findProject(projectId) {
      if (logger) {
        logger.info({ message: "Looking up TestRail project", projectId });
      }
      throw notConfiguredError();
    },

    async findOrCreateSection(projectId, sectionName) {
      if (logger) {
        logger.info({ message: "Ensuring TestRail section", projectId, sectionName });
      }
      throw notConfiguredError();
    },

    async addCase(projectId, sectionId, casePayload) {
      if (logger) {
        logger.info({
          message: "Adding TestRail case",
          projectId,
          sectionId,
          title: casePayload.title
        });
      }
      throw notConfiguredError();
    },

    async findCasesByTitleAndReference() {
      return { supported: false, matches: [] };
    },

    defaults: DEFAULTS
  };
};

module.exports = {
  createTestrailMcpClient
};
