'use client'

import { useState } from 'react'
import AdminNav from './AdminNav'
import AdminHeader from './AdminHeader'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <AdminHeader 
        onMenuToggle={toggleMobileMenu} 
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex">
        {/* Navigation Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 bg-bg-secondary border-r border-bg-tertiary overflow-y-auto">
          <AdminNav onNavigate={closeMobileMenu} />
        </aside>

        {/* Navigation Sidebar - Mobile/Tablet */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Slide-in Menu */}
            <aside className="fixed left-0 top-16 bottom-0 w-64 bg-bg-secondary border-r border-bg-tertiary z-50 lg:hidden overflow-y-auto">
              <AdminNav onNavigate={closeMobileMenu} />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
