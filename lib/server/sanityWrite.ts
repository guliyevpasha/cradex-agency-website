/**
 * Server-only Sanity client with the write token (chat inbox, combo orders).
 * Never import from client components: the token must stay on the server.
 * @author Paşa Quliyev — Cradex Agency
 */
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const token = process.env.SANITY_WRITE_TOKEN

// Placeholder values from .env.local.example must not count as configured.
const real = (v?: string) => Boolean(v && v.length > 30 && !/your|xxx|placeholder/i.test(v))

export const storageReady = () => Boolean(projectId) && real(token)

export const writer = () =>
  createClient({ projectId: projectId || 'unconfigured', dataset, apiVersion, token, useCdn: false, perspective: 'published' })
