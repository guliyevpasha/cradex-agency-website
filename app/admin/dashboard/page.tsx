import { redirect } from 'next/navigation'
import { getSession } from '@/lib/admin/auth'
import { getAllContentCounts } from '@/lib/admin/data'
import AdminLayout from '@/components/admin/Layout/AdminLayout'
import DashboardCard from '@/components/admin/Dashboard/DashboardCard'
import { FileText, Briefcase, Users, MessageSquare } from 'lucide-react'

export default async function DashboardPage() {
  // Check authentication
  const session = await getSession()
  
  if (!session) {
    redirect('/admin')
  }

  // Get content counts from JSON files
  const counts = getAllContentCounts()

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-secondary">
            Welcome back, {session.user.username}! Manage your website content.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Articles Card */}
          <DashboardCard
            title="Articles"
            description="Manage blog posts and journal entries"
            count={counts.articles}
            icon={FileText}
            href="/admin/articles"
            color="bg-accent-primary"
          />

          {/* Portfolio Card */}
          <DashboardCard
            title="Portfolio"
            description="Showcase your projects and work"
            count={counts.portfolio}
            icon={Briefcase}
            href="/admin/portfolio"
            color="bg-accent-secondary"
          />

          {/* Partners Card */}
          <DashboardCard
            title="Partners"
            description="Display partner logos and links"
            count={counts.partners}
            icon={Users}
            href="/admin/partners"
            color="bg-green-500"
          />

          {/* Testimonials Card */}
          <DashboardCard
            title="Testimonials"
            description="Client reviews and feedback"
            count={counts.testimonials}
            icon={MessageSquare}
            href="/admin/testimonials"
            color="bg-orange-500"
          />
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 bg-bg-secondary border border-bg-tertiary rounded-lg p-6">
          <h2 className="text-xl font-display font-bold text-text-primary mb-4">
            Quick Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-primary">{counts.articles}</p>
              <p className="text-sm text-text-secondary mt-1">Articles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-secondary">{counts.portfolio}</p>
              <p className="text-sm text-text-secondary mt-1">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{counts.partners}</p>
              <p className="text-sm text-text-secondary mt-1">Partners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{counts.testimonials}</p>
              <p className="text-sm text-text-secondary mt-1">Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
