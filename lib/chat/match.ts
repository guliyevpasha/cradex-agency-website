/**
 * Finds the best stored answer for a visitor's question. No AI: questions
 * are normalised (Azerbaijani/Turkish letters folded, suffixes cut to a
 * short stem) and compared by shared words. When nothing is close enough
 * the question goes to a person instead of getting a wrong answer.
 * @author Paşa Quliyev — Cradex Agency
 */

export type Entry = {
  question: string
  answer: string
  /** Extra words that should lead here, e.g. "qiymət, neçəyə". */
  keywords?: string[]
}

const FOLD: Record<string, string> = { ə: 'e', ı: 'i', ö: 'o', ü: 'u', ş: 's', ç: 'c', ğ: 'g', і: 'i', ё: 'е', й: 'и' }

// Words that say nothing about the topic in the four site languages.
const STOP = new Set(
  [
    'və', 'ya', 'da', 'də', 'bu', 'o', 'bir', 'mən', 'siz', 'sizin', 'mənim', 'üçün', 'ilə', 'nə', 'necə', 'neçə', 'var', 'yox', 'mi', 'mı', 'mu', 'mü', 'edir', 'olur', 'olunur', 'salam', 'zəhmət', 'olmasa',
    'the', 'a', 'an', 'is', 'are', 'do', 'does', 'can', 'i', 'you', 'your', 'my', 'to', 'of', 'for', 'and', 'or', 'in', 'on', 'how', 'what', 'it', 'me', 'we', 'hi', 'hello',
    'и', 'в', 'на', 'с', 'а', 'я', 'вы', 'ваш', 'мне', 'как', 'что', 'это', 'ли', 'для', 'у', 'по', 'есть', 'можно', 'здравствуйте', 'привет',
    've', 'bir', 'için', 'ile', 'ne', 'nasıl', 'mı', 'mi', 'var', 'ben', 'siz', 'merhaba',
  ].map((w) => fold(w))
)

function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/[əıöüşçğіёй]/g, (c) => FOLD[c] ?? c)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
}

/** Lowercase, folded words, suffixes cut: "saytınızın" and "sayt" meet at "sayt". */
export function stems(text: string): string[] {
  const words = fold(text)
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
  return [...new Set(words.map((w) => (w.length > 5 ? w.slice(0, 5) : w)))]
}

export type Match = { entry: Entry; score: number }

/**
 * Score = share of the visitor's words found in the entry, with a bonus for
 * keyword hits. At least one real word must match and the share must pass
 * `threshold`, otherwise there is no answer.
 */
export function bestMatch(question: string, entries: Entry[], threshold = 0.5): Match | null {
  const q = stems(question)
  if (q.length === 0) return null
  let best: Match | null = null
  for (const entry of entries) {
    const base = new Set(stems(entry.question))
    const keys = new Set((entry.keywords ?? []).flatMap(stems))
    let hits = 0
    for (const w of q) {
      if (keys.has(w)) hits += 1.25
      else if (base.has(w)) hits += 1
    }
    if (hits === 0) continue
    const score = Math.min(1, hits / q.length)
    if (!best || score > best.score) best = { entry, score }
  }
  return best && best.score >= threshold ? best : null
}

/** A bare greeting gets a greeting back, not a forwarded question. */
export const isGreeting = (text: string) =>
  /^(salam|salamlar|hi|hello|hey|привет|здравствуйте|merhaba|selam)[\s!.,]*$/i.test(text.trim())
