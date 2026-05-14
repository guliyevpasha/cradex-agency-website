const fs = require('fs');
const paths = ['messages/az.json', 'messages/en.json', 'messages/ru.json', 'messages/tr.json'];
function findObjectEnd(text, startIndex) {
  let inString = false;
  let escape = false;
  let depth = 0;

  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') {
      depth++;
      continue;
    }
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        return i + 1;
      }
    }
  }
  return -1;
}

for (const p of paths) {
  const file = fs.readFileSync(p, 'utf8');
  const first = file.indexOf('"calculator"');
  if (first === -1) {
    console.error(p, 'no calculator key found');
    continue;
  }
  const brace = file.indexOf('{', first);
  if (brace === -1) {
    console.error(p, 'no brace after calculator');
    continue;
  }
  const end = findObjectEnd(file, brace);
  if (end === -1) {
    console.error(p, 'no matching brace found');
    continue;
  }

  let sliceEnd = end;
  if (file[sliceEnd] === ',') sliceEnd++;
  const after = file.slice(sliceEnd, sliceEnd + 50);
  const m = after.match(/^[\s\r\n]*/);
  if (m) sliceEnd += m[0].length;

  const updated = file.slice(0, first) + file.slice(sliceEnd);
  const count = (updated.match(/"calculator"/g) || []).length;
  console.log(`${p}: removed first calculator, remaining count ${count}`);
  fs.writeFileSync(p, updated, 'utf8');
}
