/**
 * Markdown subset → Sanity Portable Text.
 *
 * Articles are authored as markdown in `content/articles/*.mjs` because that is
 * what a person can actually read and edit in a diff. Sanity stores bodies as
 * Portable Text, so the import step converts. Supported, deliberately, is only
 * what the journal renders: `## ` / `### ` headings, `- ` bullets, `1. `
 * numbered items, `> ` quotes, paragraphs, and `**bold**` inline.
 */

let keySeed = 0
function key() {
  keySeed += 1
  return `k${keySeed.toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

/** Splits a line into spans, marking `**bold**` runs as `strong`. */
function toSpans(line) {
  const spans = []
  for (const part of line.split(/(\*\*[^*]+\*\*)/g)) {
    if (!part) continue
    const strong = part.startsWith('**') && part.endsWith('**') && part.length > 4
    spans.push({
      _type: 'span',
      _key: key(),
      text: strong ? part.slice(2, -2) : part,
      marks: strong ? ['strong'] : [],
    })
  }
  if (!spans.length) spans.push({ _type: 'span', _key: key(), text: line, marks: [] })
  return spans
}

function block(style, line, extra = {}) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: toSpans(line),
    ...extra,
  }
}

export function markdownToPortableText(markdown) {
  const blocks = []

  for (const raw of markdown.trim().split(/\n{2,}/)) {
    const chunk = raw.trim()
    if (!chunk) continue

    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)

    if (chunk.startsWith('## ')) {
      blocks.push(block('h2', chunk.slice(3)))
      continue
    }
    if (chunk.startsWith('### ')) {
      blocks.push(block('h3', chunk.slice(4)))
      continue
    }
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      for (const line of lines) {
        blocks.push(
          block('normal', line.replace(/^\d+\.\s/, ''), { listItem: 'number', level: 1 })
        )
      }
      continue
    }
    if (lines.every((l) => l.startsWith('- '))) {
      for (const line of lines) {
        blocks.push(block('normal', line.slice(2), { listItem: 'bullet', level: 1 }))
      }
      continue
    }
    if (chunk.startsWith('> ')) {
      blocks.push(block('blockquote', lines.map((l) => l.replace(/^>\s?/, '')).join(' ')))
      continue
    }

    blocks.push(block('normal', lines.join(' ')))
  }

  return blocks
}

/** Rough reading time: 200 words a minute, never below 3. */
export function readingTime(markdown) {
  const words = markdown.trim().split(/\s+/).length
  return Math.max(3, Math.round(words / 200))
}

export function wordCount(markdown) {
  return markdown.trim().split(/\s+/).length
}
