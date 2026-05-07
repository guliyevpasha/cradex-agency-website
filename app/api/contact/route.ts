import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/components/forms/contactSchema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check — bots fill this field, humans don't
    if (body.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Zod validation
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { fullName, email, phone, service, message } = result.data

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL ?? 'info@cradexagency.com'

    if (resendApiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)

      await resend.emails.send({
        from: 'Cradex Agency <noreply@cradexagency.com>',
        to: contactEmail,
        subject: `Yeni əlaqə formu: ${fullName}`,
        html: `
          <h2>Yeni Əlaqə Formu Mesajı</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;font-weight:bold">Ad Soyad:</td><td style="padding:8px">${fullName}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">E-poçt:</td><td style="padding:8px">${email}</td></tr>
            ${phone ? `<tr><td style="padding:8px;font-weight:bold">Telefon:</td><td style="padding:8px">${phone}</td></tr>` : ''}
            ${service ? `<tr><td style="padding:8px;font-weight:bold">Xidmət:</td><td style="padding:8px">${service}</td></tr>` : ''}
            <tr><td style="padding:8px;font-weight:bold">Mesaj:</td><td style="padding:8px">${message}</td></tr>
          </table>
        `,
      })
    } else {
      // Development: log to console
      console.log('Contact form submission:', { fullName, email, phone, service, message })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
