import {
  Award,
  Camera,
  Code,
  FileText,
  Palette,
  Share2,
  Sparkles,
  TrendingUp,
  Tv,
  type LucideIcon,
} from 'lucide-react'

/**
 * services.data.json stores an icon name per service, and those names were
 * always Lucide ones. Four separate components had each grown their own
 * name -> emoji lookup instead, so the same service showed a 📈 on the home
 * page while the mega menu — which passes real Lucide components — drew the
 * proper icon. This is the single place that mapping lives now.
 */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Tv,
  Share2,
  Palette,
  Camera,
  Award,
  FileText,
  Code,
}

export function ServiceIcon({
  name,
  className = 'w-6 h-6',
}: {
  name: string
  className?: string
}) {
  const Icon = SERVICE_ICONS[name] ?? Sparkles
  // Slightly lighter than Lucide's default 2, which reads better at the sizes
  // these are drawn at and matches the thin type used around them.
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />
}
