import { redirect } from 'next/navigation'
import { getSession } from '@/lib/admin/auth'
import AdminLayout from '@/components/admin/Layout/AdminLayout'
import ArticleEditor from '@/components/admin/Articles/ArticleEditor'
import fs from 'fs'
import path from 'path'
import { ArticlesData, Article } from '@/types/admin'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArticleEditorPage({ params }: PageProps) {
  // Check authentication
  const session = await getSession()
  
  if (!session) {
    redirect('/admin')
  }

  const { id } = await params
  
  // Read articles from JSON file
  const filePath = path.join(process.cwd(), 'public', 'data', 'articles.json')
  let article: Article | null = null
  
  if (id !== 'new') {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(fileContent) as ArticlesData
      article = data.articles.find(a => a.id === id) || null
    } catch (error) {
      console.error('Error reading articles.json:', error)
    }
  }

  return (
    <AdminLayout>
      <ArticleEditor article={article} isNew={id === 'new'} />
    </AdminLayout>
  )
}
