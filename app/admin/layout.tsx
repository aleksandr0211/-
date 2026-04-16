import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './components/admin-sidebar'

export const metadata = {
  title: 'Админ-панель - AROMATIC',
  description: 'Управление магазином',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const isAdmin = user.user_metadata?.is_admin === true

  if (!isAdmin) {
    redirect('/admin/login?error=not_admin')
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  )
}
