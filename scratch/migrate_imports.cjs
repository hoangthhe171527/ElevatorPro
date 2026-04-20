const fs = require("fs");
const path = require("path");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetImport = "@/components/common/StatusBadge";
const newLibrary = "@/lib/status-variants";

// Constants to move
const constants = [
  "jobStatusVariant",
  "jobStatusLabel",
  "contractStatusVariant",
  "contractStatusLabel",
  "leadStatusVariant",
  "leadStatusLabel",
  "elevatorStatusVariant",
  "elevatorStatusLabel",
  "priorityVariant",
  "priorityLabel",
];

walk("src", (filePath) => {
  if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) return;
  if (filePath.includes("status-variants.ts")) return;

  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(targetImport)) return;

  let newContent = content;

  // Find import lines matching the target
  const importRegex = new RegExp(`import\\s+\\{([^}]+)\\}\\s+from\\s+["']${targetImport}["']`, "g");

  newContent = newContent.replace(importRegex, (match, p1) => {
    const parts = p1.split(",").map((s) => s.trim());
    const fromBadge = parts.filter((p) => p === "StatusBadge");
    const fromLib = parts.filter((p) => constants.includes(p));

    let result = "";
    if (fromBadge.length > 0) {
      result += `import { StatusBadge } from "${targetImport}";\n`;
    }
    if (fromLib.length > 0) {
      result += `import { ${fromLib.join(", ")} } from "${newLibrary}";`;
    }
    return result.trim();
  });

  if (newContent !== content) {
    console.log(`Updating imports in ${filePath}`);
    fs.writeFileSync(filePath, newContent, "utf8");
  }
});
