import { redirect } from 'next/navigation'
import { getSession } from '@/lib/admin/auth'
import AdminLayout from '@/components/admin/Layout/AdminLayout'
import ArticlesList from '@/components/admin/Articles/ArticlesList'
import fs from 'fs'
import path from 'path'
import { ArticlesData } from '@/types/admin'

export default async function ArticlesPage() {
  // Check authentication
  const session = await getSession()
  
  if (!session) {
    redirect('/admin')
  }

  // Read articles from JSON file
  const filePath = path.join(process.cwd(), 'public', 'data', 'articles.json')
  let articles: ArticlesData['articles'] = []
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent) as ArticlesData
    articles = data.articles || []
  } catch (error) {
    console.error('Error reading articles.json:', error)
    articles = []
  }

  return (
    <AdminLayout>
      <ArticlesList articles={articles} />
    </AdminLayout>
  )
}
