import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { projectId, dataset } from './sanity/env'
import { DuplicateAction } from './sanity/lib/documentActions'
import { analyticsPlugin } from './sanity/plugins/analyticsPlugin'
import { structure, templates } from './sanity/structure'
import { CompleteOrderAction, StartOrderAction } from './sanity/lib/orderActions'

export default defineConfig({
  name: 'default',
  title: 'Cradex Agency CMS',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool({ structure }), visionTool(), analyticsPlugin()],

  schema: {
    types: schemaTypes,
    templates,
  },

  document: {
    // Orders only come from the site: no "new", no duplicate (a copy would
    // lose the private id), but the WhatsApp start / done buttons up front.
    actions: (prev, context) =>
      context.schemaType === 'comboOrder'
        ? [StartOrderAction, CompleteOrderAction, ...prev.filter((a) => a.action !== 'duplicate')]
        : [...prev, DuplicateAction],
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'comboOrder'),
  },
})
