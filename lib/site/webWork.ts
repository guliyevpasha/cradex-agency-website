/**
 * What was done on a website project: one list for the Studio checkboxes,
 * the project page and the translations (site.projectBuild.items).
 * @author Paşa Quliyev — Cradex Agency
 */
export const WORK_ITEMS = [
  { value: 'design', title: 'UI/UX dizayn' },
  { value: 'responsive', title: 'Mobil və planşet uyğunlaşdırma' },
  { value: 'frontend', title: 'Frontend proqramlaşdırma' },
  { value: 'backend', title: 'Backend və verilənlər bazası' },
  { value: 'cms', title: 'İdarəetmə paneli (CMS)' },
  { value: 'multilang', title: 'Çoxdilli struktur' },
  { value: 'catalog', title: 'Kataloq və filtrlər' },
  { value: 'ecommerce', title: 'Səbət və onlayn sifariş' },
  { value: 'booking', title: 'Onlayn bron və rezervasiya' },
  { value: 'search', title: 'Axtarış sistemi' },
  { value: 'forms', title: 'Müraciət formaları' },
  { value: 'blog', title: 'Bloq və xəbərlər bölməsi' },
  { value: 'gallery', title: 'Layihə və qalereya bölməsi' },
  { value: 'animations', title: 'Animasiya və slayderlər' },
  { value: 'accounts', title: 'İstifadəçi girişi və kabinet' },
  { value: 'integrations', title: 'WhatsApp və sosial inteqrasiyalar' },
  { value: 'darkmode', title: 'Gecə / gündüz rejimi' },
] as const

export type WorkItem = (typeof WORK_ITEMS)[number]['value']

export const isWorkItem = (v: unknown): v is WorkItem => WORK_ITEMS.some((w) => w.value === v)
