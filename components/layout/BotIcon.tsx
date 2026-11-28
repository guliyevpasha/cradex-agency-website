/**
 * Chat assistant mark: the Cradex eye inside a speech bubble, white on the
 * brand-blue launcher. The pupil looks around and blinks (".bi-*" in
 * app/globals.css).
 * @author Paşa Quliyev — Cradex Agency
 */
export function BotIcon({ size = 34 }: { size?: number }) {
  return (
    <svg className="bi" width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <path d="M5 10a6 6 0 0 1 6-6h14a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-8l-6 5v-5a6 6 0 0 1-6-6z" fill="#fff" />
      <path d="M9 15c3-4.5 6-6 9-6s6 1.5 9 6c-3 4.5-6 6-9 6s-6-1.5-9-6z" fill="#0B0D10" />
      <circle className="bi-pupil" cx="18" cy="15" r="3.1" fill="#24A0FF" />
    </svg>
  )
}
