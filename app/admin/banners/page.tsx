import { createClient } from '@/lib/supabase/server'
import { BannersManager } from './banners-manager'

export default async function AdminBannersPage() {
  const supabase = await createClient()
  
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Баннеры
      </h1>

      <BannersManager banners={banners || []} />
    </div>
  )
}
