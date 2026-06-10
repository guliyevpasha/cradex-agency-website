import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString()
  
  // Log incoming request
  console.log(`[Revalidate] Incoming request at ${timestamp}`)
  console.log(`[Revalidate] Content-Type: ${request.headers.get('content-type')}`)
  console.log(`[Revalidate] Origin: ${request.headers.get('origin') || 'unknown'}`)
  
  // Token authentication
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.REVALIDATION_TOKEN
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    console.warn(`[Revalidate] Unauthorized request attempt at ${timestamp}`)
    console.warn(`[Revalidate] Auth header present: ${!!authHeader}`)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Parse the request body
    const body = await request.json()
    
    // Extract _type and slug from the webhook payload
    const { _type, slug } = body
    
    // Log request details
    console.log(`[Revalidate] Request details:`, {
      contentType: _type,
      slug: slug || 'N/A',
      timestamp,
      fullPayload: body
    })
    
    // Validate required fields
    if (!_type) {
      console.error(`[Revalidate] Missing required field: _type at ${timestamp}`)
      console.error(`[Revalidate] Received payload:`, body)
      return NextResponse.json(
        { error: 'Missing required field: _type' },
        { status: 400 }
      )
    }
    
    console.log(`[Revalidate] Starting revalidation for content type: ${_type}`)
    
    // Define locales
    const locales = ['az', 'en', 'ru', 'tr']
    const revalidatedPaths: string[] = []
    
    // Revalidate paths based on content type
    if (_type === 'blog' || _type === 'article') {
      console.log(`[Revalidate] Processing blog/article content`)
      // Revalidate journal listing pages for all locales
      locales.forEach(locale => {
        const journalPath = `/${locale}/journal`
        revalidatePath(journalPath)
        revalidatedPaths.push(journalPath)
      })
      console.log(`[Revalidate] Revalidated journal listing pages for all locales`)
      
      // Revalidate specific article page if slug exists
      if (slug) {
        locales.forEach(locale => {
          const articlePath = `/${locale}/journal/${slug}`
          revalidatePath(articlePath)
          revalidatedPaths.push(articlePath)
        })
        console.log(`[Revalidate] Revalidated article page with slug: ${slug}`)
      }
    } else if (_type === 'portfolio' || _type === 'portfolioItem') {
      console.log(`[Revalidate] Processing portfolio content`)
      // Revalidate portfolio listing pages for all locales
      locales.forEach(locale => {
        const portfolioPath = `/${locale}/portfolio`
        revalidatePath(portfolioPath)
        revalidatedPaths.push(portfolioPath)
      })
      console.log(`[Revalidate] Revalidated portfolio listing pages for all locales`)
      
      // Revalidate homepage (has portfolio preview)
      locales.forEach(locale => {
        const homePath = `/${locale}`
        revalidatePath(homePath)
        revalidatedPaths.push(homePath)
      })
      console.log(`[Revalidate] Revalidated homepage for all locales`)
    } else if (_type === 'testimonial' || _type === 'partner') {
      console.log(`[Revalidate] Processing testimonial/partner content`)
      // Revalidate homepage only (shows testimonials and partners)
      locales.forEach(locale => {
        const homePath = `/${locale}`
        revalidatePath(homePath)
        revalidatedPaths.push(homePath)
      })
      console.log(`[Revalidate] Revalidated homepage for all locales`)
    } else {
      console.warn(`[Revalidate] Unknown content type: ${_type} - no paths revalidated`)
    }
    
    // Log successful revalidation
    console.log(`[Revalidate] ✓ Revalidation successful at ${timestamp}`)
    console.log(`[Revalidate] Content type: ${_type}`)
    console.log(`[Revalidate] Slug: ${slug || 'N/A'}`)
    console.log(`[Revalidate] Total paths revalidated: ${revalidatedPaths.length}`)
    console.log(`[Revalidate] Revalidated paths:`, revalidatedPaths)
    
    // Return success response
    return NextResponse.json({
      success: true,
      revalidated: true,
      _type,
      slug: slug || null,
      paths: revalidatedPaths,
      timestamp: Date.now(),
    })
  } catch (error) {
    // Enhanced error logging
    console.error(`[Revalidate] ✗ Error during revalidation at ${timestamp}`)
    console.error(`[Revalidate] Error type: ${error instanceof Error ? error.name : typeof error}`)
    console.error(`[Revalidate] Error message: ${error instanceof Error ? error.message : String(error)}`)
    console.error(`[Revalidate] Error stack:`, error instanceof Error ? error.stack : 'No stack trace available')
    console.error(`[Revalidate] Request details at time of error:`, {
      timestamp,
      contentType: request.headers.get('content-type'),
      origin: request.headers.get('origin')
    })
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
}
