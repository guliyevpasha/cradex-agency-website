/**
 * "How the site was built" on a project page: the work that was done, as
 * small 3D tiles, and under it the full technology stack on a dark panel,
 * grouped (languages, platform, libraries, design, services, hosting).
 * Both come from the project's Studio entry (workDone, tools); the section
 * is left out when neither is filled in.
 * @author Paşa Quliyev — Cradex Agency
 */
import { getTranslations } from 'next-intl/server'
import { BookOpen, Boxes, CalendarCheck, Code2, Database, FileInput, Globe2, Images, LayoutDashboard, MessageCircle, MoonStar, PenTool, Search, ShoppingCart, Smartphone, Sparkles, UserRound, type LucideIcon } from 'lucide-react'
import { isWorkItem, type WorkItem } from '@/lib/site/webWork'
import { groupTools } from '@/lib/site/webTech'
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Tilt } from '@/components/ui/Tilt'

const ICONS: Record<WorkItem, LucideIcon> = {
  design: PenTool,
  responsive: Smartphone,
  frontend: Code2,
  backend: Database,
  cms: LayoutDashboard,
  multilang: Globe2,
  catalog: Boxes,
  ecommerce: ShoppingCart,
  booking: CalendarCheck,
  search: Search,
  forms: FileInput,
  blog: BookOpen,
  gallery: Images,
  animations: Sparkles,
  accounts: UserRound,
  integrations: MessageCircle,
  darkmode: MoonStar,
}

export async function ProjectBuild({ work, tools, locale }: { work?: string[]; tools: string[]; locale: string }) {
  const items = (work ?? []).filter(isWorkItem)
  if (items.length === 0 && tools.length === 0) return null
  const t = await getTranslations({ locale, namespace: 'site.projectBuild' })
  const groups = groupTools(tools)

  return (
    <section className="pb-section relative overflow-hidden py-20">
      <span aria-hidden="true" className="pb-glow" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent-ink">{t('eyebrow')}</p>
          <AnimatedHeading className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-4xl" text={t('title')} />
        </div>

        {items.length > 0 && (
          <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((id, i) => {
              const Icon = ICONS[id]
              return (
                <li key={id}>
                  <Reveal className="rv-3d h-full" delay={(i % 4) * 80}>
                    <Tilt max={10} className="h-full" innerClassName="h-full">
                      <div className="pb-tile">
                        <span className="pb-step tilt-z1">{String(i + 1).padStart(2, '0')}</span>
                        <span className="pb-icon tilt-z3" aria-hidden="true">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <span className="tilt-z2 text-[15px] font-semibold leading-snug text-text-primary">{t(`items.${id}`)}</span>
                      </div>
                    </Tilt>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        )}

        {groups.length > 0 && (
          <Reveal className="rv-3d mt-6" delay={120}>
            <Tilt max={3}>
              <div className="pb-stack">
                <span aria-hidden="true" className="pb-ring" />
                <div className="tilt-z1 relative flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-snow/70">{t('tech')}</p>
                  <p className="text-sm font-semibold tabular-nums text-snow/60">{tools.length}</p>
                </div>
                <dl className="tilt-z2 relative mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                  {groups.map((g, n) => (
                    <div key={g.group}>
                      <dt className="pb-group">{t(`groups.${g.group}`)}</dt>
                      <dd className="mt-2.5 flex flex-wrap gap-2">
                        {g.tools.map((tool, i) => (
                          <span key={tool} className="pb-chip" style={{ animationDelay: `${((n + i) % 5) * -0.9}s` }}>
                            {tool}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Tilt>
          </Reveal>
        )}
      </div>
    </section>
  )
}
