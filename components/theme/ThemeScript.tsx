/**
 * Sets the theme class before first paint so there is no light/dark flash.
 * Stored choice wins; otherwise the device setting is used.
 * @author Paşa Quliyev — Cradex Agency
 */
export const THEME_STORAGE_KEY = 'cradex-theme'

const script = `(function(){try{var k='${THEME_STORAGE_KEY}',s=localStorage.getItem(k),d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){}})()`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
