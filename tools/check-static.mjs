import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlFiles = [
  "index.html",
  ...fs.readdirSync(path.join(root, "pages"))
    .filter((file) => file.endsWith(".html"))
    .sort()
    .map((file) => path.join("pages", file))
];
const textFiles = [
  ...htmlFiles,
  "assets/prototype.css",
  "assets/prototype.js",
  "README.md"
].filter((file) => fs.existsSync(path.join(root, file)));

const expectedNav = [
  "overview",
  "sign-in",
  "onboarding",
  "career-map",
  "jobs",
  "job-detail",
  "source-finder",
  "fit-evaluation",
  "fit-score-guide",
  "resume-tailoring",
  "extension",
  "applications",
  "privacy"
];

const errors = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const report = (file, message) => {
  errors.push(`${file}: ${message}`);
};

for (const file of textFiles) {
  const source = read(file);
  if (/<<<<<<<|=======|>>>>>>>/.test(source)) {
    report(file, "contains merge conflict markers");
  }
}

for (const file of htmlFiles) {
  const source = read(file);
  const h1Count = [...source.matchAll(/<h1\b[^>]*>/g)].length;
  if (h1Count !== 1) {
    report(file, `expected exactly one <h1>, found ${h1Count}`);
  }

  if (/<style\b/i.test(source)) {
    report(file, "contains an inline <style> block");
  }

  if (/class="[^"]*"[^>]*\bclass="/i.test(source)) {
    report(file, "contains duplicate class attributes on one element");
  }

  const isPage = file.startsWith("pages/");
  const cssHref = isPage ? "../assets/prototype.css" : "assets/prototype.css";
  const jsSrc = isPage ? "../assets/prototype.js" : "assets/prototype.js";
  if (!source.includes(`href="${cssHref}"`)) {
    report(file, `missing shared stylesheet ${cssHref}`);
  }
  if (!source.includes(`src="${jsSrc}"`)) {
    report(file, `missing shared script ${jsSrc}`);
  }

  if (isPage) {
    const nav = [...source.matchAll(/data-nav="([^"]+)"/g)].map((match) => match[1]);
    if (nav.join("|") !== expectedNav.join("|")) {
      report(file, `sidebar nav mismatch: ${nav.join(", ")}`);
    }
  }

  const ids = new Set([...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const attr of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = attr[1];
    if (!value || /^(https?:|mailto:|tel:|data:)/i.test(value)) continue;
    if (value === "#") continue;

    const [rawTarget, rawHash] = value.split("#");
    const targetPath = rawTarget || file;
    const normalized = path.normalize(path.join(path.dirname(file), targetPath));

    if (rawTarget && !exists(normalized)) {
      report(file, `missing local target ${value}`);
      continue;
    }

    if (rawHash) {
      const targetSource = rawTarget ? read(normalized) : source;
      const targetIds = rawTarget
        ? new Set([...targetSource.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))
        : ids;
      if (!targetIds.has(rawHash)) {
        report(file, `missing fragment target ${value}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Static check passed for ${htmlFiles.length} HTML files.`);
