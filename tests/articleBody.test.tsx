import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleBody } from '@/components/journal/ArticleBody'
import { portableTextToPlainText } from '@/sanity/lib/normalize'
import { markdownToPortableText } from '../scripts/lib/portable-text.mjs'

/**
 * The journal round-trip: an article is authored as markdown, converted to
 * Portable Text for Sanity, flattened back on read, and rendered.
 *
 * Everything an article actually uses — headings, emphasis, numbered steps,
 * bullets, quotes — has to survive all three hops. Before this was covered,
 * bold reached the reader as literal asterisks and numbered lists collapsed
 * into one paragraph.
 */

const SOURCE = `## Birinci ay

Bu **vacib** bir cümlədir.

1. Səhifə sürəti
2. Mobil uyğunluq
3. Təkrarlanan başlıqlar

### Alt başlıq

- Birinci bənd
- **İkinci** bənd

> Səhv sorğularda birinci olmaq, doğru sorğularda üçüncü olmaqdan pisdir.`

function roundTrip(markdown: string): string {
  return portableTextToPlainText(markdownToPortableText(markdown))
}

describe('article round-trip: markdown → Portable Text → render', () => {
  it('keeps every structural element through the conversion', () => {
    const out = roundTrip(SOURCE)

    expect(out).toContain('## Birinci ay')
    expect(out).toContain('### Alt başlıq')
    expect(out).toContain('**vacib**')
    expect(out).toContain('1. Səhifə sürəti')
    expect(out).toContain('3. Təkrarlanan başlıqlar')
    expect(out).toContain('- Birinci bənd')
    expect(out).toContain('> Səhv sorğularda')
  })

  it('renders headings, emphasis, ordered and unordered lists, and quotes', () => {
    const { container } = render(<ArticleBody content={roundTrip(SOURCE)} />)

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Birinci ay')
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Alt başlıq')

    // Emphasis arrives as <strong>, not as literal asterisks.
    expect(container.querySelectorAll('strong')[0].textContent).toBe('vacib')
    expect(container.textContent).not.toContain('**')

    const ol = container.querySelector('ol')
    expect(ol?.querySelectorAll('li')).toHaveLength(3)
    expect(ol?.querySelectorAll('li')[1].textContent).toBe('Mobil uyğunluq')

    const ul = container.querySelector('ul')
    expect(ul?.querySelectorAll('li')).toHaveLength(2)

    expect(container.querySelector('blockquote')?.textContent).toContain('doğru sorğularda')
  })

  it('renders a real article body without leaking markdown syntax', async () => {
    const article = (await import('../content/articles/01-google-birinci-sehife-90-gun.mjs')).default

    for (const locale of ['az', 'en', 'ru', 'tr'] as const) {
      const { container, unmount } = render(
        <ArticleBody content={roundTrip(article.body[locale])} />
      )
      const text = container.textContent ?? ''

      expect(container.querySelectorAll('h2').length).toBeGreaterThan(2)
      expect(container.querySelectorAll('strong').length).toBeGreaterThan(0)
      expect(text).not.toContain('**')
      expect(text).not.toMatch(/^##\s/m)
      unmount()
    }
  })
})
