import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// createClient throws on an empty projectId, so without the placeholder merely
// importing this module fails wherever Sanity is unconfigured — a fresh checkout
// or the test run. Nothing reaches the placeholder project: the data layer checks
// for a real projectId first and falls back to the bundled JSON, see
// shouldUseSanity() in lib/data/journal.ts.
export const client = createClient({
  projectId: projectId || 'unconfigured',
  dataset,
  apiVersion,
  useCdn: false, // Required for ISR to fetch fresh data on revalidation
})
