/**
 * Fails if any design-system component carries a hardcoded value.
 *
 * Scope is src/components — the playground chrome in src/app is deliberately
 * exempt, and src/tokens is generated. Everything a component renders must
 * resolve to a global token.
 *
 * Run: npm run lint:tokens
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scanDir = join(root, 'src/components');

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const PX = /(?<![\w-])(\d*\.?\d+)px\b/g;
const RAW_COLOR_FN = /\b(rgb|rgba|hsl|hsla)\s*\(/g;

// SVG path data is geometry, not design tokens — exempt those lines.
const isPathData = (line) => /^\s*(paperclip|calendar|star|archive|trash|clock|unread|check|bookmark|chevronDown|checkboxO(n|ff))\s*:/.test(line) || /^\s*'M[\d.]/.test(line) || /viewBox=/.test(line);

/**
 * Blanks out comments so prose can name a value the design uses without
 * tripping the check — only what actually ships is linted. `inBlock` carries
 * the /* ... *\/ state across lines; it is shared by CSS and TS/TSX.
 */
function stripComments(line, state) {
  let out = '';
  for (let i = 0; i < line.length; i++) {
    if (state.inBlock) {
      if (line[i] === '*' && line[i + 1] === '/') { state.inBlock = false; i++; }
      continue;
    }
    if (line[i] === '/' && line[i + 1] === '*') { state.inBlock = true; i++; continue; }
    // `//` starts a comment unless it is the `://` of a URL in a string.
    if (line[i] === '/' && line[i + 1] === '/' && line[i - 1] !== ':') break;
    out += line[i];
  }
  return out;
}

const violations = [];
for (const file of walk(scanDir)) {
  if (!/\.(css|tsx|ts)$/.test(file)) continue;
  const rel = relative(root, file);
  const state = { inBlock: false };
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((raw, i) => {
      const line = stripComments(raw, state);
      if (isPathData(line)) return;
      const flag = (re, kind) => {
        for (const m of line.matchAll(re)) {
          if (kind === 'px' && Number(m[1]) === 0) continue;
          violations.push({ file: rel, line: i + 1, kind, value: m[0], text: raw.trim().slice(0, 90) });
        }
      };
      flag(HEX, 'hex colour');
      flag(PX, 'px literal');
      flag(RAW_COLOR_FN, 'raw colour fn');
    });
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} hardcoded value(s) found in src/components:\n`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.kind} "${v.value}"\n    ${v.text}`);
  console.error('\nUse a global token from src/tokens/tokens.css instead.\n');
  process.exit(1);
}

const files = walk(scanDir).filter((f) => /\.(css|tsx|ts)$/.test(f)).length;
console.log(`✓ No hardcoded values across ${files} component file(s) — all values resolve to global tokens.`);
