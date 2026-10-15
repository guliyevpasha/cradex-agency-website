import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { projectId, dataset } from './sanity/env'
import { DuplicateAction } from './sanity/lib/documentActions'
import { analyticsPlugin } from './sanity/plugins/analyticsPlugin'

export default defineConfig({
  name: 'default',
  title: 'Cradex Agency CMS',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool(), visionTool(), analyticsPlugin()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Add duplicate action to all document types
      return [...prev, DuplicateAction]
    },
  },
})
