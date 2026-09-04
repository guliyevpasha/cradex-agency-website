// Pass-through on purpose. The two branches below render their own <html> and
// <body>: app/[locale]/layout.tsx needs lang to follow the active locale, and
// app/studio/layout.tsx sits outside locale routing entirely. Rendering a shell
// here as well nested one <html> inside another, and hydration then compared the
// inner lang="az" against this outer lang="en" and warned on every page.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
