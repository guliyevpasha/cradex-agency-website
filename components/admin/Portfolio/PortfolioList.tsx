'use client'

import { useState } from 'react'
import { PortfolioItem } from '@/types/admin'
import ContentList from '@/components/admin/List/ContentList'
import ContentCard from '@/components/admin/List/ContentCard'
import { Calendar, User, Tag, ExternalLink } from 'lucide-react'

interface PortfolioListProps {
  portfolio: PortfolioItem[]
}

export default function PortfolioList({ portfolio }: PortfolioListProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)

  const handleDeleteClick = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPortfolioId) return

    try {
      const response = await fetch(`/api/admin/portfolio/${selectedPortfolioId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete portfolio item')
      }

      // Refresh the page to show updated list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete portfolio item. Please try again.')
    } finally {
      setShowDeleteModal(false)
      setSelectedPortfolioId(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setSelectedPortfolioId(null)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  return (
    <>
      <ContentList
        title="Portfolio"
        description="Manage portfolio projects in 4 languages"
        createHref="/admin/portfolio/new"
        createLabel="Add New Project"
        emptyMessage="No portfolio items found. Add your first project!"
        isEmpty={portfolio.length === 0}
      >
        {portfolio.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title.az}
            subtitle={item.description.az.length > 100 ? `${item.description.az.substring(0, 100)}...` : item.description.az}
            editHref={`/admin/portfolio/${item.id}`}
            onDelete={() => handleDeleteClick(item.id)}
            metadata={
              <>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {item.client}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {item.serviceCategory}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.completedAt)}
                </span>
                {item.featured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Featured
                  </span>
                )}
                {item.projectUrl && (
                  <span className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <a 
                      href={item.projectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project
                    </a>
                  </span>
                )}
              </>
            }
          />
        ))}
      </ContentList>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-display font-bold text-text-primary mb-4">
              Confirm Delete
            </h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-lg border border-bg-tertiary text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
