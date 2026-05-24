import fs from 'node:fs';
import path from 'node:path';

const dir = 'content/posts';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let moved = 0;

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const match = content.match(/^date:\s*(\d{4})-(\d{2})/m);
  if (!match) { console.log('NO DATE:', f); continue; }
  const year = match[1];
  const month = match[2];
  const dest = path.join(dir, year, month);
  fs.mkdirSync(dest, { recursive: true });
  fs.renameSync(path.join(dir, f), path.join(dest, f));
  moved++;
}
console.log(`Moved ${moved} files`);
