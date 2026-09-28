import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAllPortfolio } from '@/lib/data/portfolio'

export async function PortfolioPreview() {
  // Get all portfolio items for the marquee (not just featured)
  const allItems = await getAllPortfolio()

  return (
    <PortfolioPreviewClient items={allItems} />
  )
}

// Client-renderable inner component
import PortfolioPreviewClient from './PortfolioPreviewClient'
