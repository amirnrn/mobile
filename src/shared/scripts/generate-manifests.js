import fs from "fs";
import path from "path";

const baseDir = path.join(process.cwd(), "src/app/applications");
const outputDir = path.join(process.cwd(), "src/app");
const outputFile = path.join(outputDir, "generated-manifests.ts");

const dirs = fs.readdirSync(baseDir);
const quotedDirs = dirs.map((dir) => `"${dir}"`);
const content = `export const manifests = [${quotedDirs.join(", ")}];`;

fs.writeFileSync(outputFile, content);
