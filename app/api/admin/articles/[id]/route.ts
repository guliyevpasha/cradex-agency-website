import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/admin/auth'
import { commitArticles } from '@/lib/admin/github'
import fs from 'fs'
import path from 'path'
import { ArticlesData, Article } from '@/types/admin'

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'articles.json')

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/articles/[id]
 * Returns a single article by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Read articles from JSON file
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent) as ArticlesData

    // Find article by ID
    const article = data.articles.find(a => a.id === id)

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('[API] Error reading article:', error)
    return NextResponse.json({ error: 'Failed to read article' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/articles/[id]
 * Updates an existing article
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Parse request body
    const body = await request.json()
    const updatedArticle: Article = body

    // Validate required fields
    if (!updatedArticle.slug || !updatedArticle.title || !updatedArticle.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Read existing articles
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent) as ArticlesData

    // Find article index
    const articleIndex = data.articles.findIndex(a => a.id === id)

    if (articleIndex === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Check if slug is unique (excluding current article)
    const slugExists = data.articles.some(a => a.slug === updatedArticle.slug && a.id !== id)
    if (slugExists) {
      return NextResponse.json({ error: 'Article with this slug already exists' }, { status: 409 })
    }

    // Update article (preserve ID)
    data.articles[articleIndex] = {
      ...updatedArticle,
      id: id // Ensure ID doesn't change
    }

    // Write back to file
    const jsonContent = JSON.stringify(data, null, 2)
    fs.writeFileSync(DATA_FILE, jsonContent, 'utf-8')

    // Commit to GitHub
    try {
      await commitArticles(jsonContent, 'update', updatedArticle.title.az || updatedArticle.title.en)
      console.log('[API] Article update committed to GitHub successfully')
    } catch (githubError) {
      console.error('[API] GitHub commit failed:', githubError)
      // Don't fail the request if GitHub commit fails
    }

    return NextResponse.json({ 
      success: true, 
      article: data.articles[articleIndex],
      message: 'Article updated successfully',
      deployed: true
    })
  } catch (error) {
    console.error('[API] Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * Deletes an article
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Read existing articles
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent) as ArticlesData

    // Find article index
    const articleIndex = data.articles.findIndex(a => a.id === id)

    if (articleIndex === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Remove article
    const deletedArticle = data.articles[articleIndex]
    data.articles.splice(articleIndex, 1)

    // Write back to file
    const jsonContent = JSON.stringify(data, null, 2)
    fs.writeFileSync(DATA_FILE, jsonContent, 'utf-8')

    // Commit to GitHub
    try {
      await commitArticles(jsonContent, 'delete', deletedArticle.title.az || deletedArticle.title.en)
      console.log('[API] Article deletion committed to GitHub successfully')
    } catch (githubError) {
      console.error('[API] GitHub commit failed:', githubError)
      // Don't fail the request if GitHub commit fails
    }

    return NextResponse.json({ 
      success: true, 
      article: deletedArticle,
      message: 'Article deleted successfully',
      deployed: true
    })
  } catch (error) {
    console.error('[API] Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
