/**
 * Chat answer matching: folding, stems and the "ask a person" fallback.
 * @author Paşa Quliyev — Cradex Agency
 */
import { describe, expect, it } from 'vitest'
import { bestMatch, isGreeting, stems, type Entry } from '@/lib/chat/match'

const entries: Entry[] = [
  { question: 'Demo həqiqətən pulsuzdur?', answer: 'demo', keywords: ['demo', 'pulsuz'] },
  { question: 'Domen və hosting qiymətə daxildirmi?', answer: 'domain', keywords: ['domen', 'hosting'] },
  { question: 'İlkin ödəniş nə qədərdir?', answer: 'initial', keywords: ['ilkin', 'avans'] },
]

describe('chat matching', () => {
  it('folds letters and cuts suffixes', () => {
    expect(stems('Saytınızın qiyməti')).toEqual(['sayti', 'qiyme'])
  })

  it('finds the answer for differently written questions', () => {
    expect(bestMatch('demo pulsuzdurmu?', entries)?.entry.answer).toBe('demo')
    expect(bestMatch('Hostinq və domen daxildir?', entries)?.entry.answer).toBe('domain')
    expect(bestMatch('ilkin odenis neçədir', entries)?.entry.answer).toBe('initial')
  })

  it('returns nothing for an unrelated question, so a person can answer', () => {
    expect(bestMatch('Ofisiniz şənbə günü açıqdır?', entries)).toBeNull()
    expect(bestMatch('???', entries)).toBeNull()
  })

  it('knows a plain greeting', () => {
    expect(isGreeting('Salam!')).toBe(true)
    expect(isGreeting('Salam, demo pulsuzdur?')).toBe(false)
  })
})
