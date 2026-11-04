/**
 * Tools shown in the "Technologies" section. Edit this list to change what
 * appears; icons come from simple-icons (CC0). A tool without an icon is
 * drawn as a coloured wordmark.
 * @author Paşa Quliyev — Cradex Agency
 */
import {
  siAndroid,
  siApple,
  siCss3,
  siFigma,
  siFirebase,
  siFlutter,
  siGoogleads,
  siGoogleanalytics,
  siGooglesearchconsole,
  siHtml5,
  siHubspot,
  siJavascript,
  siJira,
  siJquery,
  siKotlin,
  siLaravel,
  siMeta,
  siNextdotjs,
  siNodedotjs,
  siNotion,
  siReact,
  siSanity,
  siSemrush,
  siSlack,
  siSwift,
  siTailwindcss,
  siTiktok,
  siTrello,
  siTypescript,
  siVercel,
  siVuedotjs,
  siAngular,
} from 'simple-icons'

type Icon = { path: string; hex: string }
export type Tool = { name: string; icon?: Icon; color?: string }

const t = (name: string, icon?: Icon, color?: string): Tool => ({ name, icon, color })

export const TECH_GROUPS = {
  web: [
    t('Next.js', siNextdotjs),
    t('React', siReact),
    t('TypeScript', siTypescript),
    t('Tailwind CSS', siTailwindcss),
    t('HTML', siHtml5),
    t('CSS', siCss3),
    t('JavaScript', siJavascript),
    t('Vue.js', siVuedotjs),
    t('Angular', siAngular),
    t('Node.js', siNodedotjs),
    t('Laravel', siLaravel),
    t('jQuery', siJquery),
    t('Sanity', siSanity),
    t('Vercel', siVercel),
    t('Figma', siFigma),
  ],
  mobile: [
    t('Flutter', siFlutter),
    t('React Native', siReact),
    t('Swift', siSwift),
    t('Kotlin', siKotlin),
    t('Firebase', siFirebase),
    t('iOS', siApple),
    t('Android', siAndroid),
    t('Figma', siFigma),
  ],
  marketing: [
    t('Search Console', siGooglesearchconsole),
    t('Google Analytics', siGoogleanalytics),
    t('Google Ads', siGoogleads),
    t('Ahrefs', undefined, '#FF8800'),
    t('Semrush', siSemrush),
    t('HubSpot', siHubspot),
    t('Meta', siMeta),
    t('TikTok', siTiktok),
  ],
  pm: [
    t('Bitrix24', undefined, '#2FC6F6'),
    t('Notion', siNotion),
    t('Trello', siTrello),
    t('Jira', siJira),
    t('Slack', siSlack),
  ],
} as const

export type TechGroup = keyof typeof TECH_GROUPS
export const TECH_GROUP_IDS = Object.keys(TECH_GROUPS) as TechGroup[]

/** Brand colours too dark for the section's dark background are shown in white. */
export function displayColor(hex: string): string {
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum < 0.3 ? '#FFFFFF' : `#${hex}`
}
