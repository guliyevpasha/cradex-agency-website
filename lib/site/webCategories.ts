/**
 * Business fields a website project can belong to. One list for the Studio
 * dropdown, the portfolio filter and the translations (site.portfolioPage.fields).
 * @author Paşa Quliyev — Cradex Agency
 */
export const WEB_FIELDS = [
  { value: 'construction', title: 'İnşaat' },
  { value: 'tourism', title: 'Turizm' },
  { value: 'education', title: 'Təhsil' },
  { value: 'cleaning', title: 'Təmizlik' },
  { value: 'health', title: 'Səhiyyə' },
  { value: 'media', title: 'Media' },
  { value: 'ecommerce', title: 'E-ticarət' },
  { value: 'restaurant', title: 'Restoran' },
  { value: 'catalog', title: 'Kataloq' },
  { value: 'hotel', title: 'Otel' },
  { value: 'auto', title: 'Avtomobil' },
  { value: 'consulting', title: 'Konsaltinq' },
  { value: 'realestate', title: 'Daşınmaz əmlak' },
] as const

export type WebField = (typeof WEB_FIELDS)[number]['value']

export const isWebField = (v: unknown): v is WebField => WEB_FIELDS.some((f) => f.value === v)

/** Cards per page on the website portfolio and on each ad platform. */
export const WORKS_PER_PAGE = 6
