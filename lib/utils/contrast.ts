/**
 * Calculates the relative luminance of an sRGB color.
 * @param hex - Hex color string (e.g. "#F0F0FF")
 */
function getLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) / 255
  const g = parseInt(clean.substring(2, 4), 16) / 255
  const b = parseInt(clean.substring(4, 6), 16) / 255

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Calculates the WCAG contrast ratio between two hex colors.
 * Returns a value between 1 (no contrast) and 21 (maximum contrast).
 */
export function calculateContrastRatio(foreground: string, background: string): number {
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Checks if a color pair meets WCAG 2.1 AA standard (minimum 4.5:1 for normal text).
 */
export function meetsWcagAA(foreground: string, background: string): boolean {
  return calculateContrastRatio(foreground, background) >= 4.5
}

/**
 * Checks if a color pair meets WCAG 2.1 AA for large text (minimum 3:1).
 */
export function meetsWcagAALargeText(foreground: string, background: string): boolean {
  return calculateContrastRatio(foreground, background) >= 3.0
}
