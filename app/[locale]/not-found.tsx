import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return <NotFoundContent />
}

function NotFoundContent() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <section className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-4">
        <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
        <h1 className="text-display-md font-display font-bold text-text-primary mb-4">
          {t('title')}
        </h1>
        <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">{t('subtitle')}</p>
        <Button href={`/${locale}`} icon={<ArrowLeft size={18} />}>
          {t('backHome')}
        </Button>
      </div>
    </section>
  )
}
