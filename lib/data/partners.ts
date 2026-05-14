/**
 * Partner logos configuration.
 *
 * Now fetches from Sanity CMS in production.
 * Fallback to static data for development/testing.
 */

import { getAllPartners as getSanityPartners, type Partner as SanityPartner } from '@/sanity/lib/queries'

export interface PartnerLogo {
  id: string
  name: string
  /** Path to image in /public, e.g. "/logos/expargo.svg" */
  logo: string
  /** Optional: alternate logo for the second marquee copy (avoids SVG id conflicts) */
  logoB?: string
}

// Static fallback data
const staticPartners: PartnerLogo[] = [
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

// Check if we should use Sanity (production) or static data (fallback)
const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test'

export async function getPartners(): Promise<PartnerLogo[]> {
  if (USE_SANITY) {
    try {
      const sanityPartners = await getSanityPartners()
      // Convert Sanity partners to PartnerLogo format
      return sanityPartners.map((p: SanityPartner) => ({
        id: p.id,
        name: p.name,
        logo: p.logo,
        logoB: undefined, // Sanity doesn't have logoB
      }))
    } catch (error) {
      console.error('Failed to fetch partners from Sanity, using fallback data:', error)
    }
  }
  return staticPartners
}

// For backward compatibility
export const partners: PartnerLogo[] = staticPartners
