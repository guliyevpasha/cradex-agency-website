/**
 * Same class name helper as lib/utils/cn.ts, kept for older imports.
 * @author Paşa Quliyev — Cradex Agency
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
