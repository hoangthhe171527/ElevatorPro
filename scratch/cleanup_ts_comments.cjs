const fs = require("fs");
const path = require("path");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk("src/routes/mobile", (filePath) => {
  if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) return;

  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("@ts-expect-error") && !content.includes("@ts-ignore")) return;

  console.log(`Cleaning TS comments in ${filePath}`);
  const newContent = content.replace(/\/\/ @ts-(expect-error|ignore).*\n/g, "");

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf8");
  }
});
