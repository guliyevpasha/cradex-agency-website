/**
 * Reviews and blog posts for one service, shown on its service, pricing and
 * product pages. Owners tag both in Studio ("Xidmətlər"); see lib/site/proof.
 * Reviews carry the service name as a badge; with none tagged the block hides.
 * @author Paşa Quliyev — Cradex Agency
 */
import { getTranslations } from 'next-intl/server'
import { getAllTestimonials } from '@/lib/data/testimonials'
import { getAllArticles } from '@/lib/data/journal'
import { postsFor, reviewsFor, type ServiceTag } from '@/lib/site/proof'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { BlogShowcase } from '@/components/home/BlogShowcase'

export async function ServiceProof({ service, locale, blogTitle, reviews = true }: { service: ServiceTag; locale: string; blogTitle?: string; reviews?: boolean }) {
  const [testimonials, articles] = await Promise.all([reviews ? getAllTestimonials() : Promise.resolve([]), getAllArticles(locale)])
  const list = reviewsFor(testimonials, service)
  // Products have their own menu copy; the rest are services.
  const isProduct = service === 'chatbot' || service === 'combo'
  const names = await getTranslations({ locale, namespace: isProduct ? 'site.productMenu' : 'site.services' })
  const badge = names(`${service}.title`)

  return (
    <>
      {reviews && list.length > 0 && <ReviewsSection testimonials={list} badge={badge} />}
      <BlogShowcase articles={postsFor(articles, service)} title={blogTitle} />
    </>
  )
}
