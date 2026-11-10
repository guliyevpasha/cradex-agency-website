/**
 * Sanity document action that triggers revalidation when slug changes
 * This prevents 404 errors when content slugs are renamed
 * @author Paşa Quliyev — Cradex Agency
 */
import { DocumentActionComponent } from 'sanity'

interface DocumentWithSlug {
  _type: string
  slug?: {
    current?: string
    _type?: string
  }
}

interface PreviousDocument extends DocumentWithSlug {
  _id: string
  _rev: string
}

export const RevalidateOnSlugChange: DocumentActionComponent = (props) => {
  const { id, type, draft, published, onComplete } = props
  
  // Only run for content types that have slugs and public pages
  const revalidateTypes = ['portfolio', 'portfolioItem', 'blog', 'article']
  if (!revalidateTypes.includes(type)) {
    return null
  }

  const currentSlug = (draft?.slug as any)?.current || (published?.slug as any)?.current
  const previousSlug = (published?.slug as any)?.current
  
  // Only show action if slug changed
  if (!draft || currentSlug === previousSlug || !previousSlug) {
    return null
  }

  return {
    label: 'Revalidate Slug Change',
    icon: () => '🔄',
    tone: 'primary',
    onHandle: async () => {
      try {
        const response = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SANITY_STUDIO_REVALIDATION_TOKEN}`,
          },
          body: JSON.stringify({
            _type: type,
            slug: currentSlug,
            previousSlug: previousSlug,
          }),
        })

        if (response.ok) {
          console.log('✅ Revalidation successful')
        } else {
          console.error('❌ Revalidation failed:', await response.text())
        }
      } catch (error) {
        console.error('❌ Revalidation error:', error)
      }
      
      onComplete()
    },
  }
}
