import type { Metadata } from 'next'

// /studio sits outside the [locale] tree, so it carries its own document shell.
// The root layout is a pass-through — see the note there.
export const metadata: Metadata = {
  title: 'Cradex Agency CMS',
  robots: { index: false, follow: false },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
