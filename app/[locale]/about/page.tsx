import type { Metadata } from 'next'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GlassCard } from '@/components/ui/GlassCard'
import { CtaSection } from '@/components/sections/CtaSection'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

const values = [
  { key: 'innovation', icon: '💡' },
  { key: 'quality', icon: '⭐' },
  { key: 'transparency', icon: '🔍' },
  { key: 'results', icon: '🎯' },
]

const team = [
  { name: 'Əli Həsənov', role: 'CEO & Founder', avatar: '👨‍💼' },
  { name: 'Leyla Məmmədova', role: 'SMM Director', avatar: '👩‍💼' },
  { name: 'Rauf Əliyev', role: 'Tech Lead', avatar: '👨‍💻' },
  { name: 'Nigar Quliyeva', role: 'Creative Director', avatar: '👩‍🎨' },
]

export default function AboutPage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale)
  return <AboutContent />
}

function AboutContent() {
  const t = useTranslations('about')

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fadeInUp">
            <h1 className="text-display-lg font-display font-bold text-text-primary mb-4">
              {t('title')}
            </h1>
            <p className="text-text-secondary text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="fadeInLeft">
              <h2 className="text-display-md font-display font-bold text-text-primary mb-4">
                {t('story.title')}
              </h2>
              <p className="text-text-secondary leading-relaxed">{t('story.content')}</p>
            </ScrollReveal>
            <ScrollReveal animation="fadeInRight" className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <span className="text-8xl">🚀</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="scaleIn">
            <GlassCard className="p-10">
              <h2 className="text-display-md font-display font-bold text-text-primary mb-4">
                {t('mission.title')}
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">{t('mission.content')}</p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-display-md font-display font-bold text-text-primary">
              {t('values.title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ScrollReveal key={value.key} animation="scaleIn" delay={index * 100}>
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-text-primary font-semibold">
                    {t(`values.${value.key}` as any)}
                  </h3>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-display-md font-display font-bold text-text-primary">
              {t('team.title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <ScrollReveal key={member.name} animation="fadeInUp" delay={index * 100}>
                <GlassCard className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-accent-primary/10 flex items-center justify-center text-4xl mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-text-primary font-semibold">{member.name}</h3>
                  <p className="text-text-muted text-sm mt-1">{member.role}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
