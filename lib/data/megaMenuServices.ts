/**
 * Mega Menu Services Configuration
 * 
 * Defines the 6 main services displayed in the services mega menu navigation.
 * Each service includes an icon, slug for routing, and translation key.
 */

import type { LucideIcon } from 'lucide-react'
import {
  TrendingUp,  // Digital Marketing
  Share2,      // Social Media Marketing
  Code,        // Web & Mobile Development
  PenTool,     // Content Writing/Copywriting
  Palette,     // Graphic Design / Motion Design
  Award        // Branding
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
    id: 'web-mobile-dev',
    slug: 'web-mobile-dev',
    icon: Code,
    translationKey: 'webMobileDev'
  },
  {
    id: 'copywriting',
    slug: 'copywriting',
    icon: PenTool,
    translationKey: 'contentWriting'
  },
  {
    id: 'graphic-motion-design',
    slug: 'graphic-motion-design',
    icon: Palette,
    translationKey: 'graphicMotionDesign'
  },
  {
    id: 'branding',
    slug: 'branding',
    icon: Award,
    translationKey: 'branding'
  }
]
