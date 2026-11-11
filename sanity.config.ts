import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { projectId, dataset } from './sanity/env'
import { LIVE_TYPES, withRefresh } from './sanity/lib/documentActions'
import { analyticsPlugin } from './sanity/plugins/analyticsPlugin'
import { structure, templates } from './sanity/structure'
import { CompleteOrderAction, StartOrderAction } from './sanity/lib/orderActions'

export default defineConfig({
  name: 'default',
  title: 'Cradex Agency CMS',

  projectId,
  dataset,

  basePath: '/studio',

  // Token login keeps the session where our own API routes can read it:
  // the analytics tab and the publish → refresh call both send it along.
  auth: { loginMethod: 'token' },

  plugins: [structureTool({ structure }), visionTool(), analyticsPlugin()],

  schema: {
    types: schemaTypes,
    templates,
  },

  document: {
    // Orders only come from the site: no "new", no duplicate (a copy would
    // lose the private id), but the WhatsApp start / done buttons up front.
    // Everything else keeps the built-in actions (one "Duplicate"); types with
    // public pages refresh the site right after publish / unpublish / delete.
    actions: (prev, context) =>
      context.schemaType === 'comboOrder'
        ? [StartOrderAction, CompleteOrderAction, ...prev.filter((a) => a.action !== 'duplicate')]
        : LIVE_TYPES.includes(context.schemaType)
          ? prev.map(withRefresh)
          : prev,
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'comboOrder'),
  },
})
