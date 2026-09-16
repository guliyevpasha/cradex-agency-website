import { getTranslations } from 'next-intl/server'
import { AboutSectionClient } from './AboutSectionClient'

interface AboutSectionProps {
  className?: string
}

export async function AboutSection({ className }: AboutSectionProps) {
  const t = await getTranslations('about')
  
  const content = {
    sectionTitle: t('sectionTitle'),
    subsections: t.raw('subsections'),
    stats: t.raw('stats'),
    ctas: {
      primary: t('cta.primary'),
      secondary: t('cta.secondary'),
    },
  }

  return <AboutSectionClient content={content} className={className} />
}
