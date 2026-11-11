import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// createClient throws on an empty projectId, so without the placeholder merely
// importing this module fails wherever Sanity is unconfigured — a fresh checkout
// or the test run. Nothing reaches the placeholder project: the data layer checks
// for a real projectId first and falls back to the bundled JSON, see
// shouldUseSanity() in lib/data/journal.ts.
//
// SANITY_PREVIEW_DRAFTS=1 in .env.local shows unpublished drafts on the local
// dev server, to review entries before they are published. Development only.
const previewToken = process.env.NODE_ENV === 'development' && process.env.SANITY_PREVIEW_DRAFTS === '1' ? process.env.SANITY_WRITE_TOKEN : undefined

export const client = createClient({
  projectId: projectId || 'unconfigured',
  dataset,
  apiVersion,
  useCdn: false, // Required for ISR to fetch fresh data on revalidation
  ...(previewToken ? { token: previewToken, perspective: 'previewDrafts' as const } : {}),
})
