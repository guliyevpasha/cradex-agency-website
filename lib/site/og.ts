/**
 * Link preview image per language (rendered by scripts/render-og.mjs).
 * Pages that set their own openGraph replace the layout's, so they pass this
 * along too, otherwise their shared links would show no picture.
 * @author Paşa Quliyev — Cradex Agency
 */
const LOCALES = ['az', 'en', 'ru', 'tr']

export function ogImage(locale: string, alt = 'Cradex Agency') {
  const lang = LOCALES.includes(locale) ? locale : 'az'
  // bump ?v= after re-rendering so WhatsApp / Facebook fetch the new picture
  return { url: `/og/home-${lang}.jpg?v=2`, width: 1200, height: 630, alt, type: 'image/jpeg' }
}
