'use client'

import Link from 'next/link'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface DashboardCardProps {
  title: string
  description: string
  count: number
  icon: LucideIcon
  href: string
  color: string
}

export default function DashboardCard({ 
  title, 
  description, 
  count, 
  icon: Icon, 
  href, 
  color 
}: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-bg-secondary border border-bg-tertiary rounded-lg p-6 hover:border-accent-primary transition-all duration-300 cursor-pointer h-full">
        {/* Icon and Count */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-text-primary">{count}</p>
            <p className="text-xs text-text-secondary">items</p>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-display font-bold text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-sm text-text-secondary">
            {description}
          </p>
        </div>

        {/* View Button */}
        <div className="flex items-center justify-between pt-4 border-t border-bg-tertiary">
          <span className="text-sm text-accent-primary font-medium group-hover:text-accent-secondary transition-colors">
            View All
          </span>
          <ArrowRight className="w-4 h-4 text-accent-primary group-hover:translate-x-1 group-hover:text-accent-secondary transition-all" />
        </div>
      </div>
    </Link>
  )
}
