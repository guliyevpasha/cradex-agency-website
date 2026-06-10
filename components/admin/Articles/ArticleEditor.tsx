'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Article, MultiLangText } from '@/types/admin'
import LanguageTabs from '@/components/admin/Editor/LanguageTabs'
import FormField from '@/components/admin/Editor/FormField'
import RichTextEditor from '@/components/admin/Editor/RichTextEditor'
import ImageUploader from '@/components/admin/Editor/ImageUploader'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface ArticleEditorProps {
  article: Article | null
  isNew: boolean
}

const categories = [
  { value: 'seo', label: 'SEO' },
  { value: 'smm', label: 'SMM' },
  { value: 'branding', label: 'Branding' },
  { value: 'design', label: 'Design' },
  { value: 'copywriting', label: 'Copywriting' },
  { value: 'web-dev', label: 'Web Development' },
  { value: 'marketing-strategy', label: 'Marketing Strategy' },
]

export default function ArticleEditor({ article, isNew }: ArticleEditorProps) {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState<'az' | 'en' | 'ru' | 'tr'>('az')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState({
    id: article?.id || '',
    slug: article?.slug || '',
    title: article?.title || { az: '', en: '', ru: '', tr: '' },
    excerpt: article?.excerpt || { az: '', en: '', ru: '', tr: '' },
    content: article?.content || { az: '', en: '', ru: '', tr: '' },
    category: article?.category || 'seo',
    author: article?.author || '',
    image: article?.image || '',
    publishedAt: article?.publishedAt || new Date().toISOString().split('T')[0],
    readingTime: article?.readingTime || 5,
  })

  // Track unsaved changes
  useEffect(() => {
    if (!isNew) {
      setHasUnsavedChanges(true)
    }
  }, [formData, isNew])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const updateMultiLangField = (field: keyof Pick<typeof formData, 'title' | 'excerpt' | 'content'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [activeLanguage]: value
      }
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate slug
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    // Validate all languages for title
    const languages: Array<'az' | 'en' | 'ru' | 'tr'> = ['az', 'en', 'ru', 'tr']
    languages.forEach(lang => {
      if (!formData.title[lang].trim()) {
        newErrors[`title_${lang}`] = `Title in ${lang.toUpperCase()} is required`
      }
      if (!formData.excerpt[lang].trim()) {
        newErrors[`excerpt_${lang}`] = `Excerpt in ${lang.toUpperCase()} is required`
      }
      if (!formData.content[lang].trim()) {
        newErrors[`content_${lang}`] = `Content in ${lang.toUpperCase()} is required`
      }
    })

    // Validate other fields
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required'
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Image is required'
    }
    if (formData.readingTime < 1) {
      newErrors.readingTime = 'Reading time must be at least 1 minute'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0]
      const element = document.getElementById(firstError)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSaving(true)

    try {
      // Generate ID for new articles
      const articleData = {
        ...formData,
        id: isNew ? `article-${Date.now()}` : formData.id,
      }

      // Call API
      const url = isNew ? '/api/admin/articles' : `/api/admin/articles/${articleData.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save article')
      }

      setHasUnsavedChanges(false)
      
      // Redirect to articles list
      router.push('/admin/articles')
      router.refresh()
    } catch (error) {
      console.error('Error saving article:', error)
      alert(error instanceof Error ? error.message : 'Failed to save article. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/admin/articles')
      }
    } else {
      router.push('/admin/articles')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles">
            <button className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary text-text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-text-primary">
              {isNew ? 'Create New Article' : 'Edit Article'}
            </h1>
            <p className="text-text-secondary mt-1">
              {isNew ? 'Fill in all 4 languages' : `Editing: ${formData.title.az || 'Untitled'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 rounded-lg border border-bg-tertiary text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="article-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="article-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Language Tabs */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6">
          <LanguageTabs
            activeLanguage={activeLanguage}
            onLanguageChange={setActiveLanguage}
          />

          {/* Multi-language fields */}
          <div className="space-y-6">
            <FormField
              label="Title"
              name={`title_${activeLanguage}`}
              value={formData.title[activeLanguage]}
              onChange={(value) => updateMultiLangField('title', value)}
              placeholder={`Enter article title in ${activeLanguage.toUpperCase()}`}
              required
              error={errors[`title_${activeLanguage}`]}
            />

            <FormField
              label="Excerpt"
              name={`excerpt_${activeLanguage}`}
              value={formData.excerpt[activeLanguage]}
              onChange={(value) => updateMultiLangField('excerpt', value)}
              type="textarea"
              rows={3}
              placeholder={`Brief description in ${activeLanguage.toUpperCase()}`}
              required
              error={errors[`excerpt_${activeLanguage}`]}
            />

            <RichTextEditor
              label="Content"
              value={formData.content[activeLanguage]}
              onChange={(value) => updateMultiLangField('content', value)}
              placeholder={`Write your article content in ${activeLanguage.toUpperCase()}`}
              required
              error={errors[`content_${activeLanguage}`]}
              rows={15}
            />
          </div>
        </div>

        {/* General fields */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-display font-bold text-text-primary mb-4">
            Article Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={(value) => setFormData(prev => ({ ...prev, slug: value }))}
              placeholder="article-url-slug"
              required
              error={errors.slug}
            />

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-text-primary">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Author"
              name="author"
              value={formData.author}
              onChange={(value) => setFormData(prev => ({ ...prev, author: value }))}
              placeholder="Author name"
              required
              error={errors.author}
            />

            <FormField
              label="Reading Time (minutes)"
              name="readingTime"
              type="number"
              value={formData.readingTime.toString()}
              onChange={(value) => setFormData(prev => ({ ...prev, readingTime: parseInt(value) || 0 }))}
              placeholder="5"
              required
              error={errors.readingTime}
            />

            <FormField
              label="Published Date"
              name="publishedAt"
              type="text"
              value={formData.publishedAt}
              onChange={(value) => setFormData(prev => ({ ...prev, publishedAt: value }))}
              placeholder="YYYY-MM-DD"
              required
            />
          </div>

          <ImageUploader
            label="Featured Image"
            value={formData.image}
            onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
            required
            error={errors.image}
          />
        </div>

        {/* Validation errors summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-500 font-medium mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside text-red-400 text-sm space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}
