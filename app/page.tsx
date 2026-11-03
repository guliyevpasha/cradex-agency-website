import { redirect } from 'next/navigation'

// The proxy normally handles "/", this is only a fallback.
export default function RootPage() {
  redirect('/az')
}
