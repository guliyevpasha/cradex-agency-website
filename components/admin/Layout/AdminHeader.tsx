'use client'

import { useRouter } from 'next/navigation'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  onMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export default function AdminHeader({ onMenuToggle, isMobileMenuOpen }: AdminHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        console.error('Logout failed')
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-bg-secondary border-b border-bg-tertiary z-30">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-lg md:text-xl font-display font-bold text-text-primary">
              Cradex Admin
            </h1>
          </div>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary">
            <User className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">Admin</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg
              bg-bg-tertiary hover:bg-red-500/10 
              text-text-secondary hover:text-red-400
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
