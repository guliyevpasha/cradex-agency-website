import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardCard from './DashboardCard'
import { FileText } from 'lucide-react'

describe('DashboardCard', () => {
  it('should render card with title and description', () => {
    render(
      <DashboardCard
        title="Articles"
        description="Manage blog posts"
        count={5}
        icon={FileText}
        href="/admin/articles"
        color="bg-accent-primary"
      />
    )

    expect(screen.getByText('Articles')).toBeInTheDocument()
    expect(screen.getByText('Manage blog posts')).toBeInTheDocument()
  })

  it('should display the correct count', () => {
    render(
      <DashboardCard
        title="Portfolio"
        description="Showcase projects"
        count={10}
        icon={FileText}
        href="/admin/portfolio"
        color="bg-accent-secondary"
      />
    )

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('items')).toBeInTheDocument()
  })

  it('should render View All button', () => {
    render(
      <DashboardCard
        title="Partners"
        description="Display partners"
        count={3}
        icon={FileText}
        href="/admin/partners"
        color="bg-green-500"
      />
    )

    expect(screen.getByText('View All')).toBeInTheDocument()
  })

  it('should have correct href link', () => {
    const { container } = render(
      <DashboardCard
        title="Testimonials"
        description="Client reviews"
        count={8}
        icon={FileText}
        href="/admin/testimonials"
        color="bg-orange-500"
      />
    )

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('href', '/admin/testimonials')
  })

  it('should handle zero count', () => {
    render(
      <DashboardCard
        title="Articles"
        description="No articles yet"
        count={0}
        icon={FileText}
        href="/admin/articles"
        color="bg-accent-primary"
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
