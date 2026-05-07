/**
 * Partner logos configuration.
 *
 * HOW TO ADD A NEW PARTNER:
 * 1. Place the logo file in `public/logos/` (PNG, SVG, WebP — any format)
 *    e.g. public/logos/mycompany.svg
 * 2. Add a new entry below with:
 *    - id: unique string
 *    - name: company name (shown as alt text and tooltip)
 *    - logo: path starting with /logos/  (e.g. "/logos/mycompany.svg")
 *    - logoB: (optional) alternate copy with unique IDs to avoid SVG conflicts
 *
 * That's it — no code changes needed anywhere else.
 */

export interface PartnerLogo {
  id: string
  name: string
  /** Path to image in /public, e.g. "/logos/expargo.svg" */
  logo: string
  /** Optional: alternate logo for the second marquee copy (avoids SVG id conflicts) */
  logoB?: string
}

export const partners: PartnerLogo[] = [
  {
    id: 'p10',
    name: 'AzPrint',
    logo: '/logos/azprint.svg',
    logoB: '/logos/azprint-b.svg',
  },
  {
    id: 'p11',
    name: 'Bakstone',
    logo: '/logos/bakstone.svg',
    logoB: '/logos/bakstone-b.svg',
  },
  {
    id: 'p12',
    name: 'Qafqaz Xaric Təhsil',
    logo: '/logos/qafqaz-xaric.svg',
    logoB: '/logos/qafqaz-xaric-b.svg',
  },
  {
    id: 'p13',
    name: 'Air Travel',
    logo: '/logos/airtravel.svg',
    logoB: '/logos/airtravel-b.svg',
  },
  {
    id: 'p14',
    name: 'ABB Bank',
    logo: '/logos/abb-bank.svg',
    logoB: '/logos/abb-bank-b.svg',
  },
  {
    id: 'p15',
    name: 'Mimelon',
    logo: '/logos/mimelon.svg',
  },
  {
    id: 'p16',
    name: 'Badamlı',
    logo: '/logos/badamli.svg',
    logoB: '/logos/badamli-b.svg',
  },
  {
    id: 'p17',
    name: 'Asel Aqropark',
    logo: '/logos/asel-aqropark.svg',
    logoB: '/logos/asel-aqropark-b.svg',
  },
  {
    id: 'p21',
    name: 'JetPrint',
    logo: '/logos/jetprint.svg',
    logoB: '/logos/jetprint-b.svg',
  },
  {
    id: 'p22',
    name: 'Expargo',
    logo: '/logos/expargo.svg',
    logoB: '/logos/expargo-b.svg',
  },
  {
    id: 'p36',
    name: 'Tertemiz',
    logo: '/logos/tertemiz.svg',
    logoB: '/logos/tertemiz-b.svg',
  },
  {
    id: 'p38',
    name: 'Arshin',
    logo: '/logos/arshin.svg',
    logoB: '/logos/arshin-b.svg',
  },
  {
    id: 'p39',
    name: 'Avrostore',
    logo: '/logos/avrostore.svg',
    logoB: '/logos/avrostore-b.svg',
  },
  {
    id: 'p40',
    name: 'Eclatex',
    logo: '/logos/eclatex.svg',
    logoB: '/logos/eclatex-b.svg',
  },
  {
    id: 'p41',
    name: 'Art Tower',
    logo: '/logos/arttower.svg',
    logoB: '/logos/arttower-b.svg',
  },
  {
    id: 'p42',
    name: 'Barami',
    logo: '/logos/barami.svg',
    logoB: '/logos/barami-b.svg',
  },
  {
    id: 'p43',
    name: 'Decoria',
    logo: '/logos/decoria.svg',
    logoB: '/logos/decoria-b.svg',
  },
  {
    id: 'p44',
    name: 'Hayat Clinic',
    logo: '/logos/hayatclinic.svg',
    logoB: '/logos/hayatclinic-b.svg',
  },
  {
    id: 'p45',
    name: 'Kango AZ',
    logo: '/logos/kangoaz.svg',
    logoB: '/logos/kangoaz-b.svg',
  },
]
