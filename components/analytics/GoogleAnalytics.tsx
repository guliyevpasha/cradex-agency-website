'use client'
/**
 * Loads the Google Analytics script when a measurement id is set and counts
 * clicks on WhatsApp / phone / e-mail links across the whole site.
 * @author Paşa Quliyev — Cradex Agency
 */

import { useEffect } from 'react'
import Script from 'next/script'
import { ctaEvent, track } from '@/lib/analytics/track'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    // one listener instead of a handler on every CTA; links inside a form are
    // that form's submit and are counted as form_submit there
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.closest('form')) return
      const name = ctaEvent(a.href)
      if (name) track(name)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      {/* Google Analytics 4 — gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || []
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date())
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            anonymize_ip: false,
            allow_google_signals: true,
            allow_ad_personalization_signals: true,
          })
        `}
      </Script>
    </>
  )
}
