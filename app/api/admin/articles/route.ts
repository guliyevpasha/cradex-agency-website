import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/admin/auth'
import { commitArticles } from '@/lib/admin/github'
import fs from 'fs'
import path from 'path'
import { ArticlesData, Article } from '@/types/admin'

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'articles.json')

/**
 * GET /api/admin/articles
 * Returns all articles
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Read articles from JSON file
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent) as ArticlesData

    return NextResponse.json({ articles: data.articles || [] })
  } catch (error) {
    console.error('[API] Error reading articles:', error)
    return NextResponse.json({ error: 'Failed to read articles' }, { status: 500 })
  }
}

/**
 * POST /api/admin/articles
 * Creates a new article
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const newArticle: Article = body

    // Validate required fields
    if (!newArticle.id || !newArticle.slug || !newArticle.title || !newArticle.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Read existing articles
    let data: ArticlesData = { articles: [] }
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
      data = JSON.parse(fileContent) as ArticlesData
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      console.log('[API] Creating new articles file')
    }

    // Check if article with same ID already exists
    const existingIndex = data.articles.findIndex(a => a.id === newArticle.id)
    if (existingIndex !== -1) {
      return NextResponse.json({ error: 'Article with this ID already exists' }, { status: 409 })
    }

    // Check if slug is unique
    const slugExists = data.articles.some(a => a.slug === newArticle.slug)
    if (slugExists) {
      return NextResponse.json({ error: 'Article with this slug already exists' }, { status: 409 })
    }

    // Add new article
    data.articles.push(newArticle)

    // Write back to file
    const jsonContent = JSON.stringify(data, null, 2)
    fs.writeFileSync(DATA_FILE, jsonContent, 'utf-8')

    // Commit to GitHub
    try {
      await commitArticles(jsonContent, 'create', newArticle.title.az || newArticle.title.en)
      console.log('[API] Article committed to GitHub successfully')
    } catch (githubError) {
      console.error('[API] GitHub commit failed:', githubError)
      // Don't fail the request if GitHub commit fails
      // The article is already saved locally
    }

    return NextResponse.json({ 
      success: true, 
      article: newArticle,
      message: 'Article created successfully',
      deployed: true // Indicates deployment is in progress
    }, { status: 201 })
  } catch (error) {
    console.error('[API] Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
