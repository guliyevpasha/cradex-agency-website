import { useTranslations, useLocale } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function CtaSection() {
  const t = useTranslations('home.cta')
  const locale = useLocale()

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal animation="scaleIn">
          <div className="glass-card p-12 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />

            <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
              {t('title')}
            </h2>
            <p className="text-text-secondary text-sm mb-6 max-w-xl mx-auto">
              {t('subtitle')}
            </p>
            <div className="flex items-center justify-center">
              <Button
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'}`}
                variant="whatsapp"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                icon={<MessageCircle size={18} />}
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
