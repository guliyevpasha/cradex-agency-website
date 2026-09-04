import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

// middleware.ts cannot be imported here: next-intl/middleware pulls in next/server,
// which does not resolve under the vitest node environment. Read the matcher out of
// the source instead, then exercise the real pattern rather than asserting on text.
const source = fs.readFileSync(path.join(process.cwd(), 'middleware.ts'), 'utf-8')
const matcherLiteral = source.match(/matcher:\s*\['([^']+)'\]/)?.[1]
// The source text still carries the escaping of a JS string literal (\\. for a dot),
// so undo one level before handing the pattern to RegExp.
const matcher = new RegExp(`^${matcherLiteral?.replace(/\\\\/g, '\\')}$`)

describe('Locale middleware matcher', () => {
  it('is declared in middleware.ts', () => {
    expect(matcherLiteral).toBeTruthy()
    expect(source).toContain('next-intl/middleware')
  })

  it('applies locale routing to content pages', () => {
    for (const p of ['/', '/about', '/journal', '/journal/some-slug', '/portfolio', '/admin']) {
      expect(matcher.test(p), `${p} should be locale-routed`).toBe(true)
    }
  })

  it('leaves API routes, Sanity Studio and Next.js internals alone', () => {
    for (const p of ['/api/revalidate', '/studio', '/studio/desk', '/_next/static/chunk.js', '/_vercel/insights']) {
      expect(matcher.test(p), `${p} should bypass locale routing`).toBe(false)
    }
  })

  it('leaves static files alone', () => {
    for (const p of ['/og-default.jpg', '/robots.txt', '/sitemap.xml', '/logos/cradex.svg']) {
      expect(matcher.test(p), `${p} should bypass locale routing`).toBe(false)
    }
  })
})
