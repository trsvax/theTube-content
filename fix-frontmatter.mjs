import fs from 'node:fs';
import path from 'node:path';

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

const files = findMd('content/posts');
let fixed = 0;

for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const m = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!m) continue;

  let fm = m[2];
  let changed = false;

  // Fix type: draft → type: journal
  if (/^type:\s*draft$/m.test(fm)) {
    fm = fm.replace(/^type:\s*draft$/m, 'type: journal');
    changed = true;
  }

  // Fix workflow: idea → workflow: draft
  if (/^workflow:\s*idea$/m.test(fm)) {
    fm = fm.replace(/^workflow:\s*idea$/m, 'workflow: draft');
    changed = true;
  }

  // Fix status: shipped → remove it
  if (/^status:\s*shipped$/m.test(fm)) {
    fm = fm.replace(/^status:\s*shipped\n?/m, '');
    changed = true;
  }

  // Fix status: qed → remove it (workflow: published says it)
  if (/^status:\s*qed$/m.test(fm)) {
    fm = fm.replace(/^status:\s*qed\n?/m, '');
    changed = true;
  }

  // Add missing audience: user (for drafts/journals without one)
  if (!/^audience:/m.test(fm)) {
    // Add after tags line
    fm = fm.replace(/^(tags:\s*.+)$/m, '$1\naudience: user');
    changed = true;
  }

  // Add missing type — determine from context
  if (!/^type:/m.test(fm)) {
    // If it has status (vague-thought, journaling, etc) it's a journal
    // If workflow: published and no status, it's a post
    const hasStatus = /^status:/m.test(fm);
    const isPublished = /^workflow:\s*published$/m.test(fm);
    const type = hasStatus ? 'journal' : (isPublished ? 'post' : 'journal');
    // Add after tags or audience line
    if (/^audience:/m.test(fm)) {
      fm = fm.replace(/^(audience:\s*.+)$/m, '$1\ntype: ' + type);
    } else {
      fm = fm.replace(/^(tags:\s*.+)$/m, '$1\ntype: ' + type);
    }
    changed = true;
  }

  // Add missing workflow: draft if not present
  if (!/^workflow:/m.test(fm)) {
    fm = fm + '\nworkflow: draft';
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, m[1] + fm + m[3] + m[4]);
    fixed++;
    console.log('fixed:', path.basename(f, '.md'));
  }
}

console.log(`\nFixed ${fixed} files`);
