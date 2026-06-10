import { redirect } from 'next/navigation'
import { getSession } from '@/lib/admin/auth'
import AdminLayout from '@/components/admin/Layout/AdminLayout'
import PortfolioList from '@/components/admin/Portfolio/PortfolioList'
import fs from 'fs'
import path from 'path'
import { PortfolioData } from '@/types/admin'

export default async function PortfolioPage() {
  // Check authentication
  const session = await getSession()
  
  if (!session) {
    redirect('/admin')
  }

  // Read portfolio from JSON file
  const filePath = path.join(process.cwd(), 'public', 'data', 'portfolio.json')
  let portfolio: PortfolioData['portfolio'] = []
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent) as PortfolioData
    portfolio = data.portfolio || []
  } catch (error) {
    console.error('Error reading portfolio.json:', error)
    portfolio = []
  }

  return (
    <AdminLayout>
      <PortfolioList portfolio={portfolio} />
    </AdminLayout>
  )
}
