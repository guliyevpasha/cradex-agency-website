'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { cn } from '@/lib/utils/cn'

const faqs = [
  {
    id: 'faq-1',
    question: 'Cradex Agency hansı xidmətləri təqdim edir?',
    answer: 'Cradex Agency rəqəmsal marketinq, SMM, brendinq, qrafik dizayn, foto/video çəkiliş, copywriting, veb-sayt və mobil tətbiq hazırlanması xidmətlərini təqdim edir.',
  },
  {
    id: 'faq-2',
    question: 'Layihənin müddəti nə qədər olur?',
    answer: 'Layihənin müddəti xidmətin növündən asılıdır. Brendinq layihəsi 2-4 həftə, veb-sayt 4-8 həftə, SMM idarəetməsi isə davamlı xidmət kimi həyata keçirilir.',
  },
  {
    id: 'faq-3',
    question: 'Qiymətlər necə müəyyənləşdirilir?',
    answer: 'Qiymətlər layihənin həcminə, müddətinə və tələb olunan resurslara görə müəyyənləşdirilir. Kalkulyator bölməsindən təxmini qiymət hesablaya bilərsiniz.',
  },
  {
    id: 'faq-4',
    question: 'Hansı ödəniş üsulları qəbul edilir?',
    answer: 'Bank köçürməsi, nağd ödəniş və onlayn ödəniş sistemləri qəbul edilir. Böyük layihələr üçün hissəli ödəniş imkanı mövcuddur.',
  },
  {
    id: 'faq-5',
    question: 'Layihə prosesini necə izləyə bilərəm?',
    answer: 'Hər layihə üçün müştəriyə xüsusi hesabat sistemi təqdim edilir. Həftəlik görüşlər və aylıq hesabatlar vasitəsilə layihənin gedişatını izləyə bilərsiniz.',
  },
]

export function FaqAccordion() {
  const t = useTranslations('home.faq')
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="py-20 bg-bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fadeInUp" className="text-center mb-12">
          <h2 className="text-display-lg font-display font-bold text-text-primary mb-3">
            {t('title')}
          </h2>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id
            return (
              <ScrollReveal key={faq.id} animation="fadeInUp" delay={index * 80}>
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span className="text-text-primary font-medium">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'text-accent-primary shrink-0 transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        role="region"
                      >
                        <p className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
