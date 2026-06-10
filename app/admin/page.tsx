import { redirect } from 'next/navigation'
import { getSession } from '@/lib/admin/auth'
import LoginForm from '@/components/admin/Auth/LoginForm'

export default async function AdminPage() {
  // Check if user is already authenticated
  const session = await getSession()
  
  if (session) {
    // Redirect to dashboard if already logged in
    redirect('/admin/dashboard')
  }

  return <LoginForm />
}
