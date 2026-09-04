export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

// An empty projectId means Sanity is not configured. The data layer treats that
// as "use the bundled JSON instead" (see lib/data/journal.ts, portfolio.ts,
// testimonials.ts); sanity/lib/client.ts keeps the client constructible so the
// import itself does not fail.
