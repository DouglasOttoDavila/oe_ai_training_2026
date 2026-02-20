const test = require("node:test");
const assert = require("node:assert/strict");
const { parseN8nOutputs } = require("./testcaseParser");

const sampleOutput = [
  {
    output: [
      "Test Case Title: Login succeeds",
      "Preconditions:",
      "- User exists",
      "Steps:",
      "1. Go to login page",
      "2. Enter valid credentials",
      "Expected Results:",
      "User is logged in",
      "---",
      "Test Case Title: Login fails",
      "Steps:",
      "1. Enter invalid credentials",
      "Expected:",
      "Error message is shown"
    ].join("\n")
  }
];

test("parseN8nOutputs parses test cases and steps", () => {
  const result = parseN8nOutputs(sampleOutput);

  assert.equal(result.cases.length, 2);
  assert.equal(result.cases[0].title, "Login succeeds");
  assert.equal(result.cases[0].steps.length, 3);
  assert.equal(result.cases[0].steps[2].action, "Execute scenario");
  assert.equal(result.cases[0].steps[2].expected, "User is logged in");

  assert.equal(result.cases[1].title, "Login fails");
  assert.equal(result.cases[1].steps.length, 2);
  assert.equal(result.cases[1].steps[1].expected, "Error message is shown");
});
