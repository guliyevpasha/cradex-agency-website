import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { AboutHero } from './AboutHero'
import { AboutIntroCards } from './AboutIntroCards'
import { AboutValues } from './AboutValues'
import { AboutServices } from './AboutServices'
import { AboutTimeline } from './AboutTimeline'
import { AboutFinalCTA } from './AboutFinalCTA'

interface AboutSectionProps {
  className?: string
}

export async function AboutSection({ className }: AboutSectionProps) {
  const locale = await getLocale()
  const t = await getTranslations('about')
  
  const hero = {
    eyebrow: t('hero.eyebrow'),
    title: t('hero.title'),
    titleAccent: t('hero.titleAccent'),
    titleEnd: t('hero.titleEnd'),
    description: t('hero.description'),
    badges: t.raw('hero.badges'),
    stats: t.raw('hero.stats'),
  }

  const intro = {
    number: t('intro.number'),
    subtitle: t('intro.subtitle'),
    title: t('intro.title'),
    cards: t.raw('intro.cards'),
  }

  const values = {
    number: t('values.number'),
    subtitle: t('values.subtitle'),
    title: t('values.title'),
    titleAccent: t('values.titleAccent'),
    titleEnd: t('values.titleEnd'),
    description: t('values.description'),
    items: t.raw('values.items'),
  }

  const services = {
    number: t('services.number'),
    subtitle: t('services.subtitle'),
    title: t('services.title'),
    titleAccent: t('services.titleAccent'),
    titleEnd: t('services.titleEnd'),
    description: t('services.description'),
    items: t.raw('services.items'),
    ctaLabel: t('services.ctaLabel'),
  }

  const timeline = {
    number: t('timeline.number'),
    subtitle: t('timeline.subtitle'),
    title: t('timeline.title'),
    titleAccent: t('timeline.titleAccent'),
    titleEnd: t('timeline.titleEnd'),
    events: t.raw('timeline.events'),
    archiveLink: t('timeline.archiveLink'),
  }

  const cta = {
    title: t('cta.title'),
    titleAccent: t('cta.titleAccent'),
    titleEnd: t('cta.titleEnd'),
    description: t('cta.description'),
    primaryButton: t('cta.primaryButton'),
    stats: t.raw('cta.stats'),
  }

  return (
    <div className={className}>
      <AboutHero {...hero} />
      <AboutIntroCards {...intro} />
      <AboutValues {...values} />
      <AboutServices {...services} locale={locale} />
      <AboutTimeline {...timeline} />
      <AboutFinalCTA {...cta} locale={locale} />
    </div>
  )
}
