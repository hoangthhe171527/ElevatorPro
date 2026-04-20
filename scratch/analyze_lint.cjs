const fs = require("fs");

function analyzeLint(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

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
      errs.slice(0, 5).forEach((e) => {
        console.log(`  - ${e.file}:${e.line} - ${e.message}`);
      });
    });
}

analyzeLint("lint-results.json");
