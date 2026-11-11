/**
 * Sorts a project's technology names into the groups the project page shows
 * (languages, platform, libraries, design, services, hosting). The catalogue
 * is shared with scripts/scan-tech.mjs; a name typed by hand in Studio that
 * is not in it lands under "other".
 * @author Paşa Quliyev — Cradex Agency
 */
import catalog from './techCatalog.json'

export const TECH_GROUPS = ['lang', 'platform', 'library', 'design', 'service', 'hosting', 'other'] as const
export type TechGroup = (typeof TECH_GROUPS)[number]

const KNOWN = catalog as Record<string, string>

export function groupTools(tools: string[]): { group: TechGroup; tools: string[] }[] {
  const by = new Map<TechGroup, string[]>()
  for (const raw of tools) {
    const name = raw.trim()
    if (!name) continue
    const group = (KNOWN[name] as TechGroup | undefined) ?? 'other'
    by.set(group, [...(by.get(group) ?? []), name])
  }
  return TECH_GROUPS.filter((g) => by.has(g)).map((group) => ({ group, tools: by.get(group) as string[] }))
}
