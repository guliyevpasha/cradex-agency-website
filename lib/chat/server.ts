/**
 * Server side of the site assistant: the answer base (site FAQs + answers
 * written in Sanity), storing unanswered questions and the e-mail alert.
 * Server only: uses the Sanity write token and the Resend key.
 * @author Paşa Quliyev — Cradex Agency
 */
import { createClient } from 'next-sanity'
import { getTranslations } from 'next-intl/server'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { PLANS, azn } from '@/lib/site/pricing'
import { SERVICE_IDS, SERVICE_SLUGS } from '@/lib/site/navigation'
import type { Entry } from './match'

const token = process.env.SANITY_WRITE_TOKEN
const resendKey = process.env.RESEND_API_KEY
const notifyTo = process.env.CONTACT_EMAIL || 'info@cradexagency.com'
const notifyFrom = process.env.CHAT_FROM_EMAIL || 'Cradex Agency <noreply@cradexagency.com>'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cradexagency.com'

// Placeholder values from .env.local.example must not count as configured.
const real = (v?: string) => Boolean(v && v.length > 30 && !/your|xxx|placeholder/i.test(v))

export const storageReady = () => Boolean(projectId) && real(token)

const writer = () =>
  createClient({ projectId: projectId || 'unconfigured', dataset, apiVersion, token, useCdn: false, perspective: 'published' })

type Faq = { q: string; a: string }

/** Everything the site already answers, in the visitor's language. */
async function siteEntries(locale: string): Promise<Entry[]> {
  const t = await getTranslations({ locale, namespace: 'site' })
  const entries: Entry[] = []
  const faqs = (key: string) => {
    if (!t.has(key)) return
    for (const f of t.raw(key) as Faq[]) entries.push({ question: f.q, answer: f.a })
  }
  faqs('faq.items')
  faqs('pricingPage.faq')
  faqs('chatbotPage.faq')
  for (const id of SERVICE_IDS) {
    faqs(`servicePage.${id}.faq`)
    // "Do you build mobile apps?" → the service in one line, with its page.
    entries.push({
      question: t(`services.${id}.title`),
      answer: `${t(`services.${id}.text`)} ${siteUrl}/${locale}/services/${SERVICE_SLUGS[id]}`,
      keywords: [t(`servicePage.${id}.metaTitle`)],
    })
  }

  // The robot's quick answers, with the words people actually type.
  entries.push(
    { question: t('bot.q1'), answer: t('bot.a1'), keywords: ['demo', 'pulsuz', 'free', 'бесплатно', 'демо', 'ücretsiz'] },
    { question: t('bot.q2'), answer: t('bot.a2'), keywords: ['xidmət', 'services', 'услуги', 'hizmet', 'nə edirsiniz'] },
    { question: t('bot.q3'), answer: t('bot.a3'), keywords: ['kombo', 'instagram', 'tiktok', 'youtube', 'izləyici', 'followers', 'подписчики', 'takipçi'] },
    {
      question: t('bot.q4'),
      answer: t('bot.a4'),
      keywords: ['ünvan', 'telefon', 'nömrə', 'əlaqə', 'whatsapp', 'ofis', 'address', 'phone', 'contact', 'адрес', 'телефон', 'adres', 'iletişim'],
    }
  )

  const from = (cat: 'cms' | 'code') => azn(Math.min(...PLANS.filter((p) => p.category === cat).map((p) => p.total)))
  entries.push({
    question: t('pricingPage.title'),
    answer: `${t('pricingPage.categories.cms.label')}: ${from('cms')}+ · ${t('pricingPage.categories.code.label')}: ${from('code')}+. ${t('pricingPage.metaDescription')}`,
    keywords: ['qiymət', 'neçəyə', 'neçə manat', 'sayt qiyməti', 'price', 'cost', 'how much', 'цена', 'стоимость', 'сколько', 'fiyat', 'kaç'],
  })
  return entries
}

const studioCache = new Map<string, { at: number; entries: Entry[] }>()

/** Answers written in Studio: ready answers plus replies marked for reuse. Cached for a minute. */
async function sanityEntries(locale: string): Promise<Entry[]> {
  if (!projectId) return []
  const hit = studioCache.get(locale)
  if (hit && Date.now() - hit.at < 60_000) return hit.entries
  try {
    const client = storageReady() ? writer() : createClient({ projectId, dataset, apiVersion, useCdn: true })
    const docs: { question?: string; answer?: string; keywords?: string[] }[] = await client.fetch(
      `*[(_type == "chatAnswer" && (!defined(locale) || locale == $locale)) || (_type == "chatQuestion" && reuse == true && defined(answer) && locale == $locale)]{question, answer, keywords}`,
      { locale }
    )
    const entries = docs.filter((d) => d.question && d.answer) as Entry[]
    studioCache.set(locale, { at: Date.now(), entries })
    return entries
  } catch (err) {
    console.error('[chat] answer base:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function answerBase(locale: string): Promise<Entry[]> {
  const [own, studio] = await Promise.all([siteEntries(locale), sanityEntries(locale)])
  // Studio answers first: the owner's wording wins a tie.
  return [...studio, ...own]
}

/*
 * IDs with a dot ("chat.…") are private in Sanity: a public dataset still
 * needs a token to read them, so visitors' questions and contacts never leak.
 */
export async function storeQuestion(q: { question: string; locale: string; page: string; session: string }) {
  const id = `chat.${crypto.randomUUID()}`
  await writer().create({ _id: id, _type: 'chatQuestion', ...q, createdAt: new Date().toISOString() })
  return id
}

export async function readAnswer(id: string, session: string): Promise<string | null> {
  const doc = await writer().getDocument<{ answer?: string; session?: string }>(id)
  if (!doc || doc.session !== session) return null
  return doc.answer?.trim() || null
}

export async function saveContact(id: string, session: string, contact: string) {
  const doc = await writer().getDocument<{ session?: string; question?: string; contact?: string; answer?: string }>(id)
  if (!doc || doc.session !== session || doc.contact || doc.answer) return false
  await writer().patch(id).setIfMissing({ contact }).commit()
  await notify(doc.question ?? '', id, contact)
  return true
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** E-mail to the owner with a direct link to the question in Studio. */
export async function notify(question: string, id: string, contact?: string, page?: string) {
  const link = `${siteUrl}/studio/structure/chatQuestion;${id}`
  if (!real(resendKey)) {
    console.warn('[chat] RESEND_API_KEY is not set, no e-mail sent for', id)
    return false
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: notifyFrom,
      to: [notifyTo],
      subject: contact ? `Çatbot: ziyarətçi əlaqə yazdı` : `Çatbot: cavab gözləyən sual`,
      html: `<p style="font:15px/1.5 sans-serif">Saytdakı köməkçi bu suala cavab tapmadı (ziyarətçinin mətni, içindəki linklərə etibar etməyin):</p>
<blockquote style="font:16px/1.5 sans-serif;border-left:3px solid #24A0FF;margin:0;padding:8px 14px">${esc(question)}</blockquote>
${contact ? `<p style="font:15px/1.5 sans-serif">Ziyarətçinin əlaqəsi: <b>${esc(contact)}</b></p>` : ''}
${page ? `<p style="font:13px/1.5 sans-serif;color:#69727F">Səhifə: ${esc(page)}</p>` : ''}
<p><a href="${link}" style="display:inline-block;background:#0A74CC;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font:600 14px sans-serif">Studio-da cavab yaz</a></p>`,
    }),
  })
  if (!res.ok) console.error('[chat] e-mail failed:', res.status)
  return res.ok
}

/*
 * Flood guard that works across server instances: the questions themselves
 * are the counter. At most DAILY_CAP forwarded questions a day site-wide and
 * SESSION_CAP an hour from one browser, so the inbox cannot be spammed.
 */
const DAILY_CAP = 50
const SESSION_CAP = 5

export async function underCaps(session: string): Promise<boolean> {
  const now = Date.now()
  const { day, mine } = await writer().fetch<{ day: number; mine: number }>(
    '{"day": count(*[_type == "chatQuestion" && createdAt > $day]), "mine": count(*[_type == "chatQuestion" && session == $session && createdAt > $hour])}',
    { day: new Date(now - 86_400_000).toISOString(), hour: new Date(now - 3_600_000).toISOString(), session }
  )
  return day < DAILY_CAP && mine < SESSION_CAP
}
