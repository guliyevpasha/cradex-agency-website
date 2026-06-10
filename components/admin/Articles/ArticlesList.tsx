'use client'

import { useState } from 'react'
import { Article } from '@/types/admin'
import ContentList from '@/components/admin/List/ContentList'
import ContentCard from '@/components/admin/List/ContentCard'
import { Calendar, User, Tag, Clock } from 'lucide-react'

interface ArticlesListProps {
  articles: Article[]
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)

  const handleDeleteClick = (articleId: string) => {
    setSelectedArticleId(articleId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedArticleId) return

    try {
      const response = await fetch(`/api/admin/articles/${selectedArticleId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete article')
      }

      // Refresh the page to show updated list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting article:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete article. Please try again.')
    } finally {
      setShowDeleteModal(false)
      setSelectedArticleId(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setSelectedArticleId(null)
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
        title="Articles"
        description="Manage blog posts and journal entries in 4 languages"
        createHref="/admin/articles/new"
        createLabel="Create New Article"
        emptyMessage="No articles found. Create your first article!"
        isEmpty={articles.length === 0}
      >
        {articles.map((article) => (
          <ContentCard
            key={article.id}
            title={article.title.az}
            subtitle={article.excerpt.az}
            editHref={`/admin/articles/${article.id}`}
            onDelete={() => handleDeleteClick(article.id)}
            metadata={
              <>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTime} min
                </span>
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
              Are you sure you want to delete this article? This action cannot be undone.
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
