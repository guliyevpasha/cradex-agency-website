/**
 * Class name helper: clsx merged through tailwind-merge.
 * @author Paşa Quliyev — Cradex Agency
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
