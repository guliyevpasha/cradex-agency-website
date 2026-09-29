import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

// Parse markdown file
function parseMarkdownArticle(content, filename) {
  const lines = content.split('\n')
  const locale = filename.includes('-AZ') ? 'az' : 
                 filename.includes('-EN') ? 'en' : 
                 filename.includes('-RU') ? 'ru' : 'tr'
  
  let title = ''
  let excerpt = ''
  let body = []
  let inFrontMatter = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Extract title (first # heading)
    if (line.startsWith('# ') && !title) {
      title = line.replace('# ', '').trim()
      continue
    }
    
    // Extract excerpt (first paragraph after title)
    if (!excerpt && title && line.trim() && !line.startsWith('#')) {
      excerpt = line.trim()
      if (excerpt.length > 200) {
        excerpt = excerpt.substring(0, 197) + '...'
      }
    }
    
    // Collect body content
    if (line.trim()) {
      body.push(line)
    }
  }
  
  return {
    title,
    excerpt,
    content: body.join('\n\n'),
    locale,
  }
}

// Create blog post in Sanity
async function createBlogPost(articles) {
  // Group articles by base name (e.g., "01-SEO-2025-2026")
  const grouped = {}
  
  articles.forEach(article => {
    const baseName = article.filename.replace(/-[A-Z]{2}\.md$/, '')
    if (!grouped[baseName]) {
      grouped[baseName] = {}
    }
    grouped[baseName][article.data.locale] = article.data
  })
  
  console.log(`\nFound ${Object.keys(grouped).length} articles to import...\n`)
  
  for (const [baseName, locales] of Object.entries(grouped)) {
    try {
      // Create slug from base name
      const slug = baseName
        .toLowerCase()
        .replace(/^\d+-/, '') // Remove leading numbers
        .replace(/[^a-z0-9]+/g, '-')
      
      // Use Azerbaijani data as primary
      const primaryData = locales.az || Object.values(locales)[0]
      
      const doc = {
        _type: 'blog',
        slug: {
          _type: 'slug',
          current: slug,
        },
        title: {
          az: locales.az?.title || primaryData.title,
          en: locales.en?.title || primaryData.title,
          ru: locales.ru?.title || primaryData.title,
          tr: locales.tr?.title || primaryData.title,
        },
        excerpt: {
          az: locales.az?.excerpt || primaryData.excerpt,
          en: locales.en?.excerpt || primaryData.excerpt,
          ru: locales.ru?.excerpt || primaryData.excerpt,
          tr: locales.tr?.excerpt || primaryData.excerpt,
        },
        content: {
          az: locales.az?.content || primaryData.content,
          en: locales.en?.content || primaryData.content,
          ru: locales.ru?.content || primaryData.content,
          tr: locales.tr?.content || primaryData.content,
        },
        category: 'seo', // Default category
        author: 'Cradex Agency',
        publishedAt: new Date().toISOString(),
        readingTime: Math.ceil((primaryData.content?.length || 0) / 1000), // ~1000 chars per minute
      }
      
      const result = await client.create(doc)
      console.log(`✓ Created: "${primaryData.title}" (${result._id})`)
    } catch (error) {
      console.error(`✗ Failed to create "${primaryData.title}":`, error.message)
    }
  }
  
  console.log('\n✓ Import completed!')
}

// Main function
async function main() {
  console.log('🚀 Starting blog article import...\n')
  
  // Check if token exists
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ Error: SANITY_WRITE_TOKEN not found in .env.local')
    console.log('\nPlease add your Sanity write token to .env.local:')
    console.log('SANITY_WRITE_TOKEN=your_token_here')
    console.log('\nGet token from: https://sanity.io/manage → Your Project → API → Tokens')
    process.exit(1)
  }
  
  // Read blog articles directory
  const articlesDir = path.resolve(__dirname, '../../BLOG-ARTICLES')
  
  if (!fs.existsSync(articlesDir)) {
    console.error(`❌ Error: BLOG-ARTICLES directory not found at ${articlesDir}`)
    process.exit(1)
  }
  
  const files = fs.readdirSync(articlesDir)
  const markdownFiles = files.filter(file => file.endsWith('.md') && file !== 'README.md')
  
  if (markdownFiles.length === 0) {
    console.error('❌ Error: No markdown files found in BLOG-ARTICLES directory')
    process.exit(1)
  }
  
  console.log(`Found ${markdownFiles.length} markdown files\n`)
  
  // Parse all articles
  const articles = markdownFiles.map(filename => {
    const filePath = path.join(articlesDir, filename)
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = parseMarkdownArticle(content, filename)
    return { filename, data }
  })
  
  // Create blog posts
  await createBlogPost(articles)
}

main().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
