const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "src");
const OUTPUT_FILE = path.join(__dirname, "src-export.txt");

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

function exportSrcToTxt() {
  const allFiles = getAllFiles(SRC_DIR);
  const lines = [];

  allFiles.forEach((filePath) => {
    const relativePath = path.relative(SRC_DIR, filePath);
    const content = fs.readFileSync(filePath, "utf-8");

    lines.push(`\n=== ${relativePath} ===\n`);
    lines.push(content);
    lines.push("\n------------------------------------\n");
  });

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
  console.log(`✅ Código exportado a ${OUTPUT_FILE}`);
}

exportSrcToTxt();
