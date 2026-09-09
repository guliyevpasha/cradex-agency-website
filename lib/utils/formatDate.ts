/**
 * Article dates, formatted as `DD.MM.YYYY`.
 *
 * The journal used `toLocaleDateString('az-AZ', { month: 'long' })`, which on
 * most Node and browser builds has no Azerbaijani month names to fall back on
 * and renders the ICU placeholder instead — readers saw "2026 M05 12" under
 * every article. Turkish and Russian were fine, but a date under an article
 * should not depend on which ICU data a given runtime happens to ship.
 *
 * `DD.MM.YYYY` is the standard written form in Azerbaijan, Turkey and Russia,
 * so one format serves every locale on the site and never renders differently
 * on the server than in the browser.
 */
export function formatArticleDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}
