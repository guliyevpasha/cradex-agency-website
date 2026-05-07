import type { Service } from '@/types'
import servicesData from './services.data.json'

export async function getAllServices(): Promise<Service[]> {
  return servicesData.services as Service[]
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getAllServices()
  return services.find((s) => s.slug === slug) ?? null
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getAllServices()
  return services.map((s) => s.slug)
}

// Synchronous versions for use in non-async contexts (e.g., property tests)
export function getAllServicesSync(): Service[] {
  return servicesData.services as Service[]
}

export function getServiceBySlugSync(slug: string): Service | null {
  return getAllServicesSync().find((s) => s.slug === slug) ?? null
}
