'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  count: number
  icon: LucideIcon
  color: string
}

export default function StatsCard({ title, count, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div 
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-text-secondary text-sm">{title}</p>
        <p className="text-text-primary text-2xl font-bold">{count}</p>
      </div>
    </div>
  )
}
