import { DocumentActionComponent } from 'sanity'
import { DocumentDuplicateIcon } from '@sanity/icons'

export const DuplicateAction: DocumentActionComponent = (props) => {
  const { draft, published, onComplete } = props

  return {
    label: 'Duplicate',
    icon: DocumentDuplicateIcon,
    onHandle: async () => {
      const { getClient } = await import('sanity')
      const client = getClient({ apiVersion: '2024-01-01' })
      
      // Get the document to duplicate
      const doc = draft || published
      if (!doc) return

      // Create a new document with the same data
      const { _id, _rev, _createdAt, _updatedAt, ...docData } = doc as any

      // Generate a unique slug if exists
      if (docData.slug?.current) {
        const timestamp = Date.now()
        docData.slug.current = `${docData.slug.current}-copy-${timestamp}`
      }

      // Update title fields if they exist
      if (docData.title) {
        if (typeof docData.title === 'object') {
          Object.keys(docData.title).forEach((key) => {
            docData.title[key] = `${docData.title[key]} (Copy)`
          })
        } else {
          docData.title = `${docData.title} (Copy)`
        }
      }

      try {
        await client.create(docData)
        onComplete()
      } catch (error) {
        console.error('Duplication failed:', error)
      }
    },
  }
}
