/**
 * Publish, unpublish and delete also tell the site to rebuild the pages that
 * show the document, so a change is live in seconds without waiting for the
 * webhook or the timed refresh. The call carries the editor's Studio token;
 * /api/revalidate checks it with Sanity.
 * @author Paşa Quliyev — Cradex Agency
 */
import { useClient, type DocumentActionComponent, type SanityDocument } from 'sanity'
import { studioToken } from './studioToken'

/** Document types that have public pages. */
export const LIVE_TYPES = ['portfolio', 'blog', 'testimonial', 'partner', 'workCase', 'comboPackage']
const WRAPPED = ['publish', 'unpublish', 'delete']

const slugOf = (doc: SanityDocument | null) => (doc?.slug as { current?: string } | undefined)?.current

function refresh(token: string, body: Record<string, unknown>) {
  if (!token) return
  const send = () =>
    fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }).catch(() => {})
  // The write lands a moment after the button is pressed; the second call
  // covers a slow one.
  setTimeout(send, 2500)
  setTimeout(send, 9000)
}

// One wrapper per action: a new component on every call would remount the
// buttons each time the Studio asks for the action list.
const wrapped = new WeakMap<DocumentActionComponent, DocumentActionComponent>()

export function withRefresh(original: DocumentActionComponent): DocumentActionComponent {
  if (!original.action || !WRAPPED.includes(original.action)) return original
  const known = wrapped.get(original)
  if (known) return known

  const Action: DocumentActionComponent = (props) => {
    const client = useClient({ apiVersion: '2024-01-01' })
    const result = original(props)
    if (!result) return result

    const body = { _type: props.type, slug: slugOf(props.draft) ?? slugOf(props.published), previousSlug: slugOf(props.published) }
    const ping = () => refresh(studioToken(client), body)

    // Delete asks for confirmation in a dialog first; refresh once it is confirmed.
    if (original.action === 'delete') {
      return { ...result, onHandle: () => result.onHandle?.(), dialog: result.dialog && 'onConfirm' in result.dialog ? { ...result.dialog, onConfirm: () => { (result.dialog as { onConfirm: () => void }).onConfirm(); ping() } } : result.dialog }
    }
    return {
      ...result,
      onHandle: () => {
        result.onHandle?.()
        ping()
      },
    }
  }
  Action.action = original.action
  Action.displayName = original.displayName
  wrapped.set(original, Action)
  return Action
}
