import { getLocale } from 'next-intl/server'
import { getAllPortfolio } from '@/lib/data/portfolio'
import PortfolioPreviewClient from './PortfolioPreviewClient'

export async function PortfolioPreview() {
  const locale = await getLocale()
  
  // Get ALL portfolio items for the marquee (no limit)
  const allItems = await getAllPortfolio(locale)
  
  console.log('[PortfolioPreview] Total items received from Sanity:', allItems.length)
  console.log('[PortfolioPreview] Portfolio clients:', allItems.map(i => i.clientName).join(', '))

  return (
    <PortfolioPreviewClient items={allItems} />
  )
}
