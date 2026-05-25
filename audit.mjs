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

function parseFM(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split('\n')) {
    const c = line.indexOf(':');
    if (c === -1) continue;
    const key = line.slice(0, c).trim();
    let val = line.slice(c + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    }
    meta[key] = val;
  }
  return meta;
}

const files = findMd('content/posts');
const issues = [];
const allKeys = new Set();
const typeCounts = {};
const workflowCounts = {};
const audienceCounts = {};
const statusCounts = {};

for (const f of files) {
  const slug = path.basename(f, '.md');
  const raw = fs.readFileSync(f, 'utf8');
  const meta = parseFM(raw);
  if (!meta) { issues.push(slug + ': NO FRONTMATTER'); continue; }

  Object.keys(meta).forEach(k => allKeys.add(k));

  // Required fields
  if (!meta.title) issues.push(slug + ': missing title');
  if (!meta.date) issues.push(slug + ': missing date');
  if (!meta.tags) issues.push(slug + ': missing tags');
  if (!meta.summary) issues.push(slug + ': missing summary');
  if (!meta.workflow) issues.push(slug + ': missing workflow');
  if (!meta.type) issues.push(slug + ': missing type');
  if (!meta.audience) issues.push(slug + ': missing audience');

  // Type consistency
  const type = meta.type || '(none)';
  typeCounts[type] = (typeCounts[type] || 0) + 1;

  // Workflow
  const wf = meta.workflow || '(none)';
  workflowCounts[wf] = (workflowCounts[wf] || 0) + 1;

  // Audience
  const aud = meta.audience || '(none)';
  audienceCounts[aud] = (audienceCounts[aud] || 0) + 1;

  // Status
  const st = meta.status || '(none)';
  statusCounts[st] = (statusCounts[st] || 0) + 1;

  // Type should be thought/post/journal — flag others
  if (meta.type && !['thought', 'post', 'journal'].includes(meta.type)) {
    issues.push(slug + ': unexpected type "' + meta.type + '"');
  }

  // Audience should be public/user/kids/friends
  if (meta.audience && !['public', 'user', 'kids', 'friends'].includes(meta.audience)) {
    issues.push(slug + ': unexpected audience "' + meta.audience + '"');
  }

  // Workflow should be draft/published
  if (meta.workflow && !['draft', 'published'].includes(meta.workflow)) {
    issues.push(slug + ': unexpected workflow "' + meta.workflow + '"');
  }
}

console.log('=== ALL FRONTMATTER KEYS ===');
console.log([...allKeys].sort().join(', '));
console.log('\n=== TYPE DISTRIBUTION ===');
console.log(typeCounts);
console.log('\n=== WORKFLOW DISTRIBUTION ===');
console.log(workflowCounts);
console.log('\n=== AUDIENCE DISTRIBUTION ===');
console.log(audienceCounts);
console.log('\n=== STATUS DISTRIBUTION ===');
console.log(statusCounts);
console.log('\n=== ISSUES (' + issues.length + ') ===');
issues.forEach(i => console.log('  ' + i));
