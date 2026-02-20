const { DEFAULTS } = require("../types");

const SECTION_ALIASES = {
  "test case title": "title",
  "title": "title",
  "preconditions": "preconditions",
  "test data": "testData",
  "steps": "steps",
  "expected results": "expected",
  "expected result": "expected",
  "expected": "expected",
  "references": "references",
  "open questions": "openQuestions",
  "assumptions": "assumptions"
};

const splitIntoChunks = (text) => {
  const normalized = text.replace(/\r\n/g, "\n");
  const parts = normalized.split(/^\s*---\s*$/m);
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
};

const normalizeHeading = (raw) => {
  const key = raw.trim().toLowerCase();
  return SECTION_ALIASES[key] || null;
};

const parseSections = (chunk) => {
  const lines = chunk.replace(/\r\n/g, "\n").split("\n");
  const sections = {
    title: [],
    preconditions: [],
    testData: [],
    steps: [],
    expected: [],
    references: [],
    openQuestions: [],
    assumptions: []
  };

  let current = null;

  for (const line of lines) {
    const headerMatch = line.match(/^\s*([A-Za-z][A-Za-z ]+?)\s*:\s*(.*)$/);
    if (headerMatch) {
      const heading = normalizeHeading(headerMatch[1]);
      if (heading) {
        current = heading;
        const inlineValue = headerMatch[2].trim();
        if (inlineValue.length > 0) {
          sections[current].push(inlineValue);
        }
        continue;
      }
    }

    if (current) {
      sections[current].push(line);
    }
  }

  return sections;
};

const cleanBlock = (lines) => {
  const text = lines.join("\n").trim();
  return text.length > 0 ? text : null;
};

const parseSteps = (stepsText) => {
  if (!stepsText) {
    return [];
  }

  const lines = stepsText.split("\n").map((line) => line.trim()).filter(Boolean);
  const steps = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[-*\s]*\d+\.?\s*/, "").replace(/^[-*]\s*/, "");
    const splitMatch = cleaned.match(/^(.*?)(?:\s*(?:->|=>|Expected\s*:))\s*(.*)$/i);

    if (splitMatch) {
      const action = splitMatch[1].trim();
      const expected = splitMatch[2].trim();
      steps.push({
        action: action || "Execute step",
        expected: expected || ""
      });
    } else {
      steps.push({
        action: cleaned || "Execute step",
        expected: ""
      });
    }
  }

  return steps;
};

const buildDescription = ({ openQuestions, assumptions }) => {
  const parts = [];
  if (openQuestions) {
    parts.push(`Open Questions:\n${openQuestions}`);
  }
  if (assumptions) {
    parts.push(`Assumptions:\n${assumptions}`);
  }
  return parts.length > 0 ? parts.join("\n\n") : null;
};

const parseTestCaseChunk = (chunk, index, logger) => {
  const sections = parseSections(chunk);
  const titleBlock = cleanBlock(sections.title);
  const preconditions = cleanBlock(sections.preconditions);
  const testData = cleanBlock(sections.testData);
  const stepsText = cleanBlock(sections.steps);
  const expectedBlock = cleanBlock(sections.expected);
  const references = cleanBlock(sections.references);
  const openQuestions = cleanBlock(sections.openQuestions);
  const assumptions = cleanBlock(sections.assumptions);

  let title = titleBlock;
  if (!title) {
    title = `Untitled test case ${index + 1}`;
    if (logger) {
      logger.warn({
        message: "Missing test case title, using placeholder",
        placeholder: title,
        index
      });
    }
  }

  const steps = parseSteps(stepsText);

  if (expectedBlock) {
    const hasExpectedInSteps = steps.some((step) => step.expected && step.expected.trim().length > 0);
    if (steps.length === 0 || !hasExpectedInSteps) {
      steps.push({
        action: "Execute scenario",
        expected: expectedBlock
      });
    }
  }

  return {
    title,
    preconditions,
    testData,
    steps,
    references,
    openQuestions,
    assumptions,
    description: buildDescription({ openQuestions, assumptions })
  };
};

const parseN8nOutputs = (outputs, options = {}) => {
  const logger = options.logger;
  const results = [];
  const errors = [];

  const textBlocks = outputs
    .map((item) => (item && typeof item.output === "string" ? item.output : ""))
    .filter((text) => text.trim().length > 0);

  for (const [blockIndex, text] of textBlocks.entries()) {
    const chunks = splitIntoChunks(text);

    for (const [chunkIndex, chunk] of chunks.entries()) {
      try {
        const globalIndex = results.length;
        const parsed = parseTestCaseChunk(chunk, globalIndex, logger);
        results.push(parsed);
      } catch (error) {
        errors.push({
          blockIndex,
          chunkIndex,
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  return {
    cases: results,
    errors
  };
};

module.exports = {
  parseN8nOutputs,
  parseTestCaseChunk,
  splitIntoChunks,
  DEFAULTS
};
