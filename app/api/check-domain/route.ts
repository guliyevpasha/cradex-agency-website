import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter required' }, { status: 400 });
  }

  try {
    // Use multiple WHOIS API services for reliability
    const response = await fetch(
      `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${process.env.WHOIS_API_KEY || 'at_demo_key'}&domainName=${domain}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('WHOIS API request failed');
    }

    const data = await response.json();

    return NextResponse.json({
      domain,
      available: data.DomainInfo?.domainAvailability === 'AVAILABLE',
      registered: data.DomainInfo?.domainAvailability !== 'AVAILABLE',
    });
  } catch (error) {
    console.error('Domain check error:', error);
    
    // Fallback: simple DNS check
    try {
      const dnsCheck = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const dnsData = await dnsCheck.json();
      
      return NextResponse.json({
        domain,
        available: !dnsData.Answer || dnsData.Answer.length === 0,
        registered: dnsData.Answer && dnsData.Answer.length > 0,
      });
    } catch {
      return NextResponse.json({
        domain,
        available: false,
        registered: true,
        error: 'Could not verify domain availability',
      });
    }
  }
}
