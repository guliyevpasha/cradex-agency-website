/**
 * Picking reviews and posts for service pages.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { postsFor, reviewsFor } from '@/lib/site/proof'

const post = (id: string, category: string, publishedAt: string, services: string[] = []) => ({ id, category, publishedAt, services })

describe('postsFor', () => {
  const posts = [
    post('a', 'seo', '2026-01-01'),
    post('b', 'smm', '2026-03-01'),
    post('c', 'web-dev', '2026-02-01', ['ads']),
    post('d', 'smm', '2026-04-01'),
  ]

  it('puts tagged posts first, then matching categories', () => {
    expect(postsFor(posts, 'ads').map((p) => p.id)).toEqual(['c', 'd', 'b'])
  })

  it('fills up with the newest when nothing matches', () => {
    expect(postsFor([post('x', 'branding', '2025-01-01'), post('y', 'design', '2026-01-01')], 'seo').map((p) => p.id)).toEqual(['y', 'x'])
  })

  it('never repeats a post and respects the limit', () => {
    const ids = postsFor(posts, 'combo', 2).map((p) => p.id)
    expect(ids).toEqual(['d', 'b'])
  })
})

describe('reviewsFor', () => {
  const reviews = [
    { id: '1', services: ['web'] },
    { id: '2', featured: true },
    { id: '3', services: ['web', 'seo'] },
  ]

  it('returns the tagged reviews', () => {
    expect(reviewsFor(reviews, 'seo').map((r) => r.id)).toEqual(['3'])
  })

  it('shows no review from another service when none is tagged', () => {
    expect(reviewsFor(reviews, 'ads')).toEqual([])
  })
})
