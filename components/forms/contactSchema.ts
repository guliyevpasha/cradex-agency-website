import { z } from 'zod'

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Ad Soyad ən azı 2 karakter olmalıdır')
    .max(100),
  email: z
    .string()
    .email('Düzgün e-poçt ünvanı daxil edin'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Düzgün telefon nömrəsi daxil edin')
    .optional()
    .or(z.literal('')),
  service: z
    .enum([
      'digital-marketing', 'traditional-marketing', 'smm',
      'graphic-motion-design', 'photo-video', 'branding',
      'copywriting', 'web-mobile-dev', 'other'
    ])
    .optional(),
  // Lead form chip selections
  selectedServices: z.array(z.string()).optional(),
  selectedBudget: z.string().optional(),
  message: z
    .string()
    .min(10, 'Mesaj ən azı 10 karakter olmalıdır')
    .max(2000),
  // Honeypot field for spam protection (should remain empty)
  honeypot: z.string().max(0).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
