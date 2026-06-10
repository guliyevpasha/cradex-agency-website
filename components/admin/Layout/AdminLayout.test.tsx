import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminLayout from './AdminLayout'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/admin/dashboard',
}))

describe('AdminLayout', () => {
  it('renders children content', () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders header with Cradex Admin title', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('Cradex Admin')).toBeInTheDocument()
  })

  it('renders navigation on desktop', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    
    // Check for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Articles')).toBeInTheDocument()
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Partners')).toBeInTheDocument()
    expect(screen.getByText('Testimonials')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    
    expect(screen.getByLabelText('Logout')).toBeInTheDocument()
  })

  it('renders mobile menu toggle button', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument()
  })
})
