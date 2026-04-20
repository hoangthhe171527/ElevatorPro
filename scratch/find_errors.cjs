const { execSync } = require("child_process");

try {
  console.log("Running lint and capturing output...");
  // Run eslint with JSON format and capture output
  // We expect it to throw an error if lint fails, which is fine
  let output;
  try {
    output = execSync("npm run lint -- --format json", {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch (e) {
    output = e.stdout.toString();
  }

  const jsonStartIndex = output.indexOf("[");
  if (jsonStartIndex === -1) {
    throw new Error("Could not find start of JSON in output");
  }
  const jsonStr = output.substring(jsonStartIndex);
  const data = JSON.parse(jsonStr);

  const nonPrettierErrors = [];
  data.forEach((fileEntry) => {
    fileEntry.messages.forEach((message) => {
      if (message.ruleId !== "prettier/prettier") {
        nonPrettierErrors.push({
          file: fileEntry.filePath,
          line: message.line,
          column: message.column,
          ruleId: message.ruleId,
          message: message.message,
          severity: message.severity,
        });
      }
    });
  });

  console.log(`Total non-prettier issues: ${nonPrettierErrors.length}`);

  const byRule = {};
  nonPrettierErrors.forEach((err) => {
    const rid = err.ruleId || "unknown";
    if (!byRule[rid]) {
      byRule[rid] = [];
    }
    byRule[rid].push(err);
  });

  Object.keys(byRule)
    .sort()
    .forEach((rid) => {
      const errs = byRule[rid];
      console.log(`\nRule: ${rid} (${errs.length} occurrences)`);
      errs.forEach((e) => {
        console.log(`  - ${e.file}:${e.line} - ${e.message}`);
      });
    });
} catch (err) {
  console.error("Critical error in analysis script:", err);
}
