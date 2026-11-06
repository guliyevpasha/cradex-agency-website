/**
 * Fallback for "/" that sends visitors to the Azerbaijani home page.
 * @author Paşa Quliyev — Cradex Agency
 */
import { redirect } from 'next/navigation'

// The proxy normally handles "/", this is only a fallback.
export default function RootPage() {
  redirect('/az')
}
