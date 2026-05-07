import type { ProcessStep } from '@/types'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useTranslations } from 'next-intl'

interface ProcessTimelineProps {
  steps: ProcessStep[]
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const t = useTranslations('services')

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fadeInUp" className="text-center mb-12">
          <h2 className="text-display-md font-display font-bold text-text-primary">
            {t('process')}
          </h2>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-accent-primary/50 via-accent-secondary/50 to-accent-primary/50 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <ScrollReveal key={step.step} animation="fadeInUp" delay={index * 100}>
                <div className="flex flex-col items-center text-center relative">
                  {/* Step number */}
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 border-2 border-accent-primary/30 flex items-center justify-center mb-4 relative z-10 bg-bg-primary">
                    <span className="text-accent-primary font-display font-bold text-xl">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-text-primary font-semibold mb-2">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
