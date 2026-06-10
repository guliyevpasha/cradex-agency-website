'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FileText, 
  Briefcase, 
  Users, 
  MessageSquare,
  LayoutDashboard
} from 'lucide-react'

interface AdminNavProps {
  onNavigate?: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    name: 'Portfolio',
    href: '/admin/portfolio',
    icon: Briefcase,
  },
  {
    name: 'Partners',
    href: '/admin/partners',
    icon: Users,
  },
  {
    name: 'Testimonials',
    href: '/admin/testimonials',
    icon: MessageSquare,
  },
]

export default function AdminNav({ onNavigate }: AdminNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <nav className="py-6 px-4">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active 
                    ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
