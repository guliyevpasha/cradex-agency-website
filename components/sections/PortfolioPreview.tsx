import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getFeaturedPortfolio } from '@/lib/data/portfolio'

export async function PortfolioPreview() {
  const featured = await getFeaturedPortfolio(6)

  return (
    <PortfolioPreviewClient items={featured} />
  )
}

// Client-renderable inner component
import PortfolioPreviewClient from './PortfolioPreviewClient'
