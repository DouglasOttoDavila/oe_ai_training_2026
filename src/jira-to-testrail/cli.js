const { runJiraToTestrail, createLogger } = require("./index");

const parseArgs = (argv) => {
  const args = {
    jiraId: null,
    dedupe: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--jira-id" && argv[i + 1]) {
      args.jiraId = argv[i + 1];
      i += 1;
    } else if (current === "--dedupe") {
      args.dedupe = true;
    }
  }

  return args;
};

const validateJiraId = (jiraId) => {
  if (!jiraId || typeof jiraId !== "string") {
    return false;
  }

  return /^[A-Z][A-Z0-9]+-\d+$/.test(jiraId.trim());
};

const main = async () => {
  const logger = createLogger();
  const args = parseArgs(process.argv);

  if (!validateJiraId(args.jiraId)) {
    logger.error({
      message: "Invalid or missing --jira-id. Expected format like DTSYS-1234."
    });
    process.exit(1);
  }

  if (args.dedupe) {
    logger.warn({ message: "--dedupe is ignored in file-only mode" });
  }

  try {
    await runJiraToTestrail({
      jiraId: args.jiraId,
      dedupe: args.dedupe,
      logger
    });
  } catch (error) {
    logger.error({
      message: "Run failed",
      error: error instanceof Error ? error.message : String(error)
    });
    process.exit(1);
  }
};

main();
