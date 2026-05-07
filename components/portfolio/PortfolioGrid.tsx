'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { PortfolioCard } from './PortfolioCard'
import type { PortfolioItem } from '@/types'

interface PortfolioGridProps {
  items: PortfolioItem[]
}

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: -10,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  const t = useTranslations('portfolio')

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <p className="text-text-muted text-lg">{t('noItems')}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              delay: index * 0.05,
            }}
          >
            <PortfolioCard item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
