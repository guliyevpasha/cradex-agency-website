/**
 * Calculates estimated reading time in minutes.
 * Formula: ceil(wordCount / 200) — average adult reading speed is ~200 wpm.
 */
export function calculateReadingTime(text: string): number {
  if (!text || text.trim().length === 0) return 1
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / 200)
}
