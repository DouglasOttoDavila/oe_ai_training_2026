const { DEFAULTS } = require("../types");

const TOOL_NAMES = {
  getProject: ["mcp_testrail_get_project"],
  addCase: ["mcp_testrail_add_case"],
  getCases: ["mcp_testrail_get_cases"]
};

const resolveTool = (options, name) => {
  if (options.mcpTools && typeof options.mcpTools[name] === "function") {
    return options.mcpTools[name];
  }

  if (typeof globalThis[name] === "function") {
    return globalThis[name];
  }

  return null;
};

const resolveToolFromList = (options, names) => {
  for (const name of names) {
    const tool = resolveTool(options, name);
    if (tool) {
      return { tool, name };
    }
  }

  return { tool: null, name: null };
};

const requireTool = (options, name) => {
  const tool = resolveTool(options, name);
  if (!tool) {
    throw new Error(`Required MCP tool is unavailable: ${name}`);
  }

  return tool;
};

const createTestrailMcpClient = (options = {}) => {
  const logger = options.logger;

  const logInfo = (payload) => {
    if (logger) {
      logger.info(payload);
    }
  };

  const logWarn = (payload) => {
    if (logger) {
      logger.warn(payload);
    }
  };

  return {
    async findProject(projectId) {
      logInfo({ message: "Looking up TestRail project", projectId });

      const { tool: getProjectTool, name } = resolveToolFromList(options, TOOL_NAMES.getProject);
      if (!getProjectTool) {
        throw new Error(
          "No project lookup tool available. Expected mcp_testrail_get_project."
        );
      }

      await getProjectTool({ project_id: projectId });
      return { id: projectId, toolName: name };
    },

    async findOrCreateSection(projectId, sectionName) {
      logInfo({ message: "Ensuring TestRail section", projectId, sectionName });

      const fallbackSectionId = Number(
        options.sectionId || process.env.TESTRAIL_SECTION_ID || 0
      );
      if (fallbackSectionId > 0) {
        logWarn({
          message: "Using TESTRAIL_SECTION_ID because section MCP tools are unavailable",
          sectionId: fallbackSectionId,
          sectionName
        });
        return fallbackSectionId;
      }

      throw new Error(
        "No section MCP tools available. Provide TESTRAIL_SECTION_ID or configure add/get section tools."
      );
    },

    async addCase(projectId, sectionId, casePayload) {
      logInfo({
        message: "Adding TestRail case",
        projectId,
        sectionId,
        title: casePayload.title
      });

      const { tool: addCaseTool } = resolveToolFromList(options, TOOL_NAMES.addCase);
      if (!addCaseTool) {
        throw new Error(
          "No case creation tool available. Expected mcp_testrail_add_case."
        );
      }

      if (casePayload.preconditions || casePayload.testData || casePayload.description) {
        logWarn({
          message: "Preconditions/test data/description are not supported by the MCP add_case tool and will be omitted",
          title: casePayload.title
        });
      }
      if (casePayload.labels && casePayload.labels.length > 0) {
        logWarn({
          message: "Labels are not supported by the MCP add_case tool and will be omitted",
          title: casePayload.title
        });
      }

      const stepsSeparated = Array.isArray(casePayload.steps)
        ? casePayload.steps.map((step) => ({
            content: step.action || "",
            expected: step.expected || ""
          }))
        : undefined;

      const payload = {
        section_id: sectionId,
        title: casePayload.title,
        refs: casePayload.references,
        type_id: Number(options.typeId || process.env.TESTRAIL_TYPE_ID || 0) || undefined,
        steps_separated: stepsSeparated
      };

      return addCaseTool(payload);
    },

    async findCasesByTitleAndReference(title, references) {
      const { tool: getCasesTool } = resolveToolFromList(options, TOOL_NAMES.getCases);
      if (!getCasesTool) {
        return { supported: false, matches: [] };
      }

      logWarn({
        message: "Case dedupe is unsupported with the available MCP tools",
        title,
        references
      });
      return { supported: false, matches: [] };
    },

    defaults: DEFAULTS
  };
};

module.exports = {
  createTestrailMcpClient,
  TOOL_NAMES,
  resolveTool,
  requireTool
};
