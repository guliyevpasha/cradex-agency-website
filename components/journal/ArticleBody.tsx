import { Fragment } from 'react'

/**
 * Renders an article body.
 *
 * Bodies arrive as the light markdown subset that `portableTextToPlainText`
 * produces from Sanity (and that the bundled fallback JSON already uses):
 * blank-line separated blocks, `## ` / `### ` headings, `- ` bullets,
 * `1. ` numbered items and `> ` quotes, with `**bold**` inline.
 *
 * This used to be an inline map inside the article page that understood only
 * headings, bullets and paragraphs — so every `**word**` an author wrote
 * reached the reader with the asterisks still in it, and numbered steps came
 * out as one run-on paragraph. Both are unavoidable in a how-to article, which
 * is most of what the journal publishes.
 */

interface ArticleBodyProps {
  content: string
}

/** Splits `**bold**` runs out of a line; everything else passes through. */
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>
  })
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (typeof content !== 'string' || !content.trim()) return null

  return (
    <>
      {content.split(/\n{2,}/).map((block, i) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)

        if (trimmed.startsWith('## ')) {
          return <h2 key={i}>{renderInline(trimmed.slice(3), `h2-${i}`)}</h2>
        }

        if (trimmed.startsWith('### ')) {
          return <h3 key={i}>{renderInline(trimmed.slice(4), `h3-${i}`)}</h3>
        }

        // Numbered list: every line looks like "1. text"
        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i}>
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.replace(/^\d+\.\s/, ''), `ol-${i}-${j}`)}</li>
              ))}
            </ol>
          )
        }

        // Bullet list: every line starts with "- "
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.slice(2), `ul-${i}-${j}`)}</li>
              ))}
            </ul>
          )
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={i}>
              {renderInline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '), `bq-${i}`)}
            </blockquote>
          )
        }

        return <p key={i}>{renderInline(trimmed, `p-${i}`)}</p>
      })}
    </>
  )
}
