import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { getAllServices, getServiceBySlug } from '@/lib/data/services'
import { getPortfolioByCategory } from '@/lib/data/portfolio'
import { ServiceHero } from '@/components/sections/ServiceHero'
import { DigitalMarketingHero } from '@/components/sections/DigitalMarketingHero'
import { PlatformsSection } from '@/components/sections/PlatformsSection'
import { AuditStrategySection } from '@/components/sections/AuditStrategySection'
import { StrategicApproach } from '@/components/sections/StrategicApproach'
import { WhoIsThisFor } from '@/components/sections/WhoIsThisFor'
import { ProcessTimeline } from '@/components/sections/ProcessTimeline'
import { Glossary } from '@/components/sections/Glossary'
import { FAQ } from '@/components/sections/FAQ'
import { RelatedPortfolioSection } from '@/components/sections/RelatedPortfolioSection'
import WebMobileDevHero from '@/components/sections/WebMobileDevHero'
import WebsiteTypesSection from '@/components/sections/WebsiteTypesSection'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'
import type { Service, PortfolioItem } from '@/types'

const locales = ['az', 'en', 'ru', 'tr']

// ISR revalidation - səhifə 60 saniyədə bir yenilənəcək
export const revalidate = 60 // saniyə

export async function generateStaticParams() {
  const services = await getAllServices()
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug }))
  )
  // 4 locales × 8 services = 32 static pages
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  const t = await getTranslations({ locale, namespace: 'services' })
  const key = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  return {
    title: t(`${key}.metaTitle` as any),
    description: t(`${key}.metaDescription` as any),
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const relatedPortfolio = await getPortfolioByCategory(service.slug)

  return <ServicePageContent service={service} relatedPortfolio={relatedPortfolio} />
}

function ServicePageContent({
  service,
  relatedPortfolio,
}: {
  service: Service
  relatedPortfolio: PortfolioItem[]
}) {
  const t = useTranslations('services')
  const locale = useLocale()
  const key = service.slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())
  
  // Special layout for digital-marketing, smm, and web-mobile-dev
  const isDigitalMarketing = service.slug === 'digital-marketing'
  const isSMM = service.slug === 'smm'
  const isWebMobileDev = service.slug === 'web-mobile-dev'
  const hasCustomLayout = isDigitalMarketing || isSMM

  // Web-mobile-dev has special hero
  if (isWebMobileDev) {
    const heroData = {
      title: 'Saytınız 48 saata hazır.',
      titleAccent: 'Əvvəlcə demosunu görün.',
      subtitle: service.name,
      description: 'Əvvəlcə biznesiniz üçün sayt demosu hazırlayıb sizə göstəririk. Bəyənsəniz, aylıq 129 AZN-dan başlayan paketlə saytınızı hazır edirik.',
      buttonText: 'Pulsuz demo istəyirəm',
      note: 'Demo pulsuzdur. Bəyənməsəniz, ödəniş yoxdur.',
    }

    return (
      <>
        <WebMobileDevHero {...heroData} />
        <ProcessTimeline steps={service.processSteps} />
        <WebsiteTypesSection />
        <WhoIsThisFor
          title="Bu xidmət kimə uyğundur?"
          subtitle="Effektiv nəticə üçün düzgün hazırlıq vacibdir. Bu xidmətin sizə uyğun olub-olmadığını aşağıdaki meyarlara əsasən qiymətləndirin."
          suitable={[
            {
              title: 'Rəqəmsal mövcudluğunu qurmaq istəyən yeni bizneslər',
              description: 'Sayt açılışından etibarən düzgün texniki əsas, SEO optimizasiyalı struktur və peşəkar dizayn üzərində böyümək istəyən startaplar.',
            },
            {
              title: 'Köhnə saytını yeniləmək istəyən bizneslər',
              description: 'Mövcud saytı köhnəlib, mobil uyğun deyil, yavaş yüklənir və ya nəticə vermirərsə — tam yeniləmə lazımdır.',
            },
            {
              title: 'Onlayn satış kanalı açmaq istəyən bizneslər',
              description: 'E-ticarət saytı hazırlanması və onlayn mağaza açmaq istəyən, satışlarını rəqəmsal kanala köçürmək istəyən bizneslər.',
            },
            {
              title: 'Reklam kampaniyaları üçün landing page lazım olanlar',
              description: 'Google Ads, Meta Ads kampaniyaları üçün yüksək konversiyalı landing page hazırlanması tələb edən bizneslər.',
            },
            {
              title: 'Peşəkar korporativ imic istəyənlər',
              description: 'Korporativ saytların hazırlanması ilə B2B müştərilərə güvən verən, şirkətin dəyərini doğru təqdim edən peşəkar bir veb mövcudluq.',
            },
          ]}
          notSuitable={[
            {
              title: 'Bir gündə sayt istəyənlər',
              description: 'Keyfiyyətli sayt hazırlanması vaxt tələb edir — ucuz, şablonlu saytlar qısa müddətdə mövcuddur, lakin nəticə baxımından fərqlidir.',
            },
            {
              title: 'Yalnız şablonlu, dəyişdirilməmiş sayt istəyənlər',
              description: 'Fərdi biznesin ehtiyaclarına uyğunlaşdırılmamış şablon saytlar uzunmüddətli rəqabət üstünlüyü yaratmır.',
            },
            {
              title: 'Davamlı texniki dəstəyə ehtiyacı olmayanlar',
              description: 'Sayt yayımdan sonra texniki dəstək, yeniləmə və optimallaşdırma tələb edir — bunu özünüz idarə edə bilmirsizsə, dəstək paketi tövsiyə olunur.',
            },
            {
              title: 'Minimum büdcə ilə maksimal funksionallıq gözləyənlər',
              description: 'Mürəkkəb funksionallıq (e-ticarət, çoxdilli, xüsusi inteqrasiyalar) müvafiq büdcə tələb edir — realist gözləntilərlə başlamaq önəmlidir.',
            },
            {
              title: 'Kontenti özü hazırlamaq istəməyənlər',
              description: 'Sayt kontenti (mətn, şəkil, video) müştəri tərəfindən hazırlanır; kontent hazırlığı olmadan inkişaf prosesi gecikir.',
            },
          ]}
          ctaText="Əmin deyilsiniz? Pulsuz məsləhət alın — vəziyyətinizi birlikdə qiymətləndirək."
        />
        <Glossary
          title="Lüğət"
          subtitle="Bu xidmətlə bağlı tez-tez rast gəlinən terminlərin qısa izahı."
          terms={[
            {
              term: 'Responsiv Dizayn',
              definition: 'Saytın müxtəlif ekran ölçülərinə (masaüstü, planşet, mobil) avtomatik uyğunlaşan dizayn — mobil uyğun sayt hazırlanmasının əsası.',
            },
            {
              term: 'UX/UI Dizayn',
              definition: 'UX (istifadəçi təcrübəsi) saytda naviqasiyanın rahatlığını, UI (istifadəçi interfeysi) isə vizual görünüşü müəyyən edir.',
            },
            {
              term: 'WordPress',
              definition: 'Dünyada ən geniş istifadə olunan CMS (məzmun idarəetmə sistemi) — WordPress sayt hazırlanması üçün asan idarə olunan, genişlənə bilən platforma.',
            },
            {
              term: 'Landing Page',
              definition: 'Yalnız bir məqsəd üçün (lead toplama, satış, qeydiyyat) dizayn edilmiş, reklam kampaniyaları üçün istifadə olunan xüsusi açılış səhifəsi.',
            },
            {
              term: 'Core Web Vitals',
              definition: 'Google-un sayt sürəti və istifadəçi təcrübəsini ölçmək üçün istifadə etdiyi texniki göstəricilər — sürətli veb sayt hazırlanmasının əsas meyarı.',
            },
            {
              term: 'SEO Optimizasiyalı Sayt',
              definition: 'Axtarış sistemlərinin (Google) tələblərinə uyğun qurulan, üzvi trafik cəlb etmək üçün optimizasiya edilmiş sayt strukturu.',
            },
            {
              term: 'CMS (Content Management System)',
              definition: 'Sayt kontentini kod bilmədən idarə etməyə imkan verən platforma (WordPress, Shopify, xüsusi CMS).',
            },
            {
              term: 'Konversiya Nisbəti',
              definition: 'Saytı ziyarət edən istifadəçilərin hədəflənən hərəkəti (alış, əlaqə forması, zəng) tamamlamasının faizi.',
            },
          ]}
        />
        <FAQ
          title="Tez-tez soruşulan suallar"
          subtitle="Veb sayt hazırlanması ilə bağlı ən çox verilən sualların cavabları."
          items={[
            {
              question: 'Veb sayt hazırlanması nə qədər vaxt aparır?',
              answer: 'Saytın mürəkkəbliyindən asılı olaraq dəyişir. Sadə biznes saytı 3–4 həftə, e-ticarət saytı hazırlanması 6–10 həftə, xüsusi funksionallıqlı korporativ sayt isə 8–16 həftə tələb edə bilər.',
            },
            {
              question: 'Sayt qiyməti Bakıda nə qədərdir?',
              answer: 'Web sayt qiymətləri saytın növündən, funksionallığından və texniki tələblərindən asılıdır. Landing page-dən korporativ sayta, onlayn mağazadan xüsusi platforma qədər müxtəlif büdcə seçimləri mövcuddur — dəqiq qiymətləndirmə üçün bizimlə əlaqə saxlayın.',
            },
            {
              question: 'WordPress sayt hazırlanması niyə üstündür?',
              answer: 'WordPress dünyada ən populyar CMS-dir — idarəsi asan, genişlənə bilən, minlərlə eklenti dəstəyi olan, SEO optimizasiyalı sayt qurmaq üçün ideal platformadır. Böyük bizneslər üçün xüsusi platforma da tövsiyə edə bilərik.',
            },
            {
              question: 'Sayt hazırlandıqdan sonra özüm dəyişiklik edə bilərəmmi?',
              answer: 'Bəli. WordPress və ya digər CMS əsaslı saytlarda kontent dəyişiklikləri (mətn, şəkil, məhsul əlavəsi) kod bilmədən edilə bilər. Yayımdan sonra idarə paneli üzrə qısa təlim keçirik.',
            },
            {
              question: 'SEO optimizasiyalı sayt nə deməkdir?',
              answer: 'Sayt hazırlanması zamanı texniki SEO əsaslarını (URL strukturu, meta teqlər, site speed, schema markup, mobil uyğunluq) tətbiq edirik ki, saytınız Google-da üst sıralara çıxmağa hazır olsun. Bu, SEO xidmətinin başlanğıc nöqtəsidir.',
            },
          ]}
          ctaButton="WhatsApp-dan soruş"
        />
        <RelatedPortfolioSection portfolios={relatedPortfolio} />
      </>
    )
  }

  return (
    <>
      {hasCustomLayout ? (
        <>
          <DigitalMarketingHero
            title={t(`${key}.name` as any)}
            description={t(`${key}.heroDescription` as any)}
            ctaStart={t(`${key}.ctaStart` as any)}
            ctaProcess={t(`${key}.ctaProcess` as any)}
            locale={locale}
            imagePath={isSMM ? '/images/smm-hero.webp' : '/images/digital-marketing-hero.webp'}
          />
          <PlatformsSection
            title={t(`${key}.platformsTitle` as any)}
            subtitle={t(`${key}.platformsSubtitle` as any)}
            platforms={t.raw(`${key}.platforms` as any)}
          />
          <AuditStrategySection
            title={t(`${key}.auditTitle` as any)}
            items={t.raw(`${key}.auditItems` as any)}
          />
          <StrategicApproach
            title={t(`${key}.strategicApproach.title` as any)}
            description={t(`${key}.strategicApproach.description` as any)}
            highlights={t.raw(`${key}.strategicApproach.highlights` as any)}
          />
          <WhoIsThisFor
            title={t(`${key}.whoIsThisFor.title` as any)}
            subtitle={t(`${key}.whoIsThisFor.subtitle` as any)}
            suitable={t.raw(`${key}.whoIsThisFor.suitable` as any)}
            notSuitable={t.raw(`${key}.whoIsThisFor.notSuitable` as any)}
            ctaText={t(`${key}.whoIsThisFor.ctaText` as any)}
          />
        </>
      ) : (
        <ServiceHero
          serviceName={t(`${key}.name` as any)}
          serviceDescription={t(`${key}.description` as any)}
        />
      )}

      {/* Process timeline */}
      <ProcessTimeline steps={service.processSteps} />

      {/* Glossary and FAQ - only for services with custom layout */}
      {hasCustomLayout && (
        <>
          <Glossary
            title={t(`${key}.glossary.title` as any)}
            subtitle={t(`${key}.glossary.subtitle` as any)}
            terms={t.raw(`${key}.glossary.terms` as any)}
          />
          <FAQ
            title={t(`${key}.faq.title` as any)}
            subtitle={t(`${key}.faq.subtitle` as any)}
            items={t.raw(`${key}.faq.items` as any)}
            ctaButton={t(`${key}.faq.ctaButton` as any)}
          />
        </>
      )}

      {/* Related portfolio */}
      <RelatedPortfolioSection portfolios={relatedPortfolio} />

      {/* CTA - only for services without custom layout */}
      {!hasCustomLayout && (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <ScrollReveal animation="scaleIn">
              <GlassCard className="p-10">
                <h2 className="text-display-md font-display font-bold text-text-primary mb-4">
                  Bu xidməti sifariş et
                </h2>
                <p className="text-text-secondary mb-8">
                  {t(`${key}.shortDesc` as any)} xidməti üçün bizimlə əlaqə saxlayın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href={`/${locale}/contact`} size="lg" icon={<ArrowRight size={18} />}>
                    Əlaqə
                  </Button>
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
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
      )}
    </>
  )
}
