/**
 * Mega Menu Services Configuration
 * 
 * Defines all services displayed in the services mega menu navigation.
 * Each service includes an icon, slug for routing, and translation key.
 */

import type { LucideIcon } from 'lucide-react'
import {
  TrendingUp,  // Digital Marketing / SEO
  Share2,      // Social Media Marketing
  Code,        // Web & Mobile Development
  PenTool,     // Content Writing/Copywriting
  Palette,     // Graphic Design / Motion Design
  Award,       // Branding
  Camera,      // Photo/Video
  Tv           // Traditional Marketing
} from 'lucide-react'

export interface MegaMenuService {
  id: string
  slug: string
  icon: LucideIcon
  translationKey: string // Key for services.megaMenu namespace
}

export const MEGA_MENU_SERVICES: MegaMenuService[] = [
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    icon: TrendingUp,
    translationKey: 'digitalMarketing'
  },
  {
    id: 'smm',
    slug: 'smm',
    icon: Share2,
    translationKey: 'socialMediaMarketing'
  },
  {
    id: 'branding',
    slug: 'branding',
    icon: Award,
    translationKey: 'branding'
  },
  {
    id: 'graphic-motion-design',
    slug: 'graphic-motion-design',
    icon: Palette,
    translationKey: 'graphicMotionDesign'
  },
  {
    id: 'web-mobile-dev',
    slug: 'web-mobile-dev',
    icon: Code,
    translationKey: 'webMobileDev'
  },
  {
    id: 'photo-video',
    slug: 'photo-video',
    icon: Camera,
    translationKey: 'photoVideo'
  },
  {
    id: 'copywriting',
    slug: 'copywriting',
    icon: PenTool,
    translationKey: 'contentWriting'
  },
  {
    id: 'traditional-marketing',
    slug: 'traditional-marketing',
    icon: Tv,
    translationKey: 'traditionalMarketing'
  }
]
