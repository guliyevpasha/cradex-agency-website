import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#080A0D',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #24A0FF 0%, #1E88E5 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>C</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>CRADEX</span>
            <span style={{ color: '#24A0FF', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>AGENCY</span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: '800',
            lineHeight: '1.1',
            color: 'white',
            margin: '0 0 24px 0',
            maxWidth: '900px',
            letterSpacing: '-2px',
          }}
        >
          Peşəkar veb sayt, reklam və rəqəmsal həllər
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '28px',
            color: '#9CA3AF',
            margin: '0 0 32px 0',
            maxWidth: '800px',
            lineHeight: '1.4',
          }}
        >
          Saytınızın demosunu 2 saata pulsuz əldə edin
        </p>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(36, 160, 255, 0.1)',
            padding: '12px 24px',
            borderRadius: '999px',
            border: '2px solid rgba(36, 160, 255, 0.3)',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              background: '#24A0FF',
              borderRadius: '50%',
            }}
          />
          <span style={{ color: '#24A0FF', fontSize: '20px', fontWeight: '600' }}>
            360° Performans Marketinq
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
