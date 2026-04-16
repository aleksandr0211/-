import { createClient } from '@/lib/supabase/server'
import { PagesManager } from './pages-manager'

export default async function AdminPagesPage() {
  const supabase = await createClient()
  
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('title')

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Страницы
      </h1>

      <PagesManager pages={pages || []} />
    </div>
  )
}
