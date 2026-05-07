'use client'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('journal.pagination')

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Səhifələmə" className="flex items-center justify-center gap-2">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t('previous')}
        className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-label={`${t('page')} ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
          className={cn(
            'w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200',
            currentPage === page
              ? 'bg-accent-primary text-white shadow-[0_0_16px_rgba(108,99,255,0.4)]'
              : 'glass-card text-text-secondary hover:text-text-primary'
          )}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t('next')}
        className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
