import fs from 'node:fs';
import path from 'node:path';

// Fix: published posts that got audience: user should be audience: public
// (they had no audience before, code defaulted to public)

function findMd(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...findMd(full));
    else if (e.name.endsWith('.md')) files.push(full);
  }
  return files;
}

// These posts already had audience: user before the fix (from git history)
// Everything else that's published + user was incorrectly set
const KNOWN_USER = new Set([
  'a-t1-to-the-house.md',
  'building-the-tube.md',
  'github-as-cms.md',
  'github-issues-as-comments.md',
  'per-repo-vault.md',
]);

const files = findMd('content/posts');
let fixed = 0;

for (const f of files) {
  const basename = path.basename(f);
  if (KNOWN_USER.has(basename)) continue;

  const raw = fs.readFileSync(f, 'utf8');
  
  // Only fix published posts that have audience: user
  if (/^workflow:\s*published$/m.test(raw) && /^audience:\s*user$/m.test(raw)) {
    const updated = raw.replace(/^audience:\s*user$/m, 'audience: public');
    fs.writeFileSync(f, updated);
    fixed++;
    console.log('fixed:', path.basename(f, '.md'));
  }
}

console.log(`\nFixed ${fixed} files to audience: public`);
