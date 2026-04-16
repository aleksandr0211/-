import { createClient } from '@/lib/supabase/server'
import { CategoriesManager } from './categories-manager'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Категории
      </h1>

      <CategoriesManager categories={categories || []} />
    </div>
  )
}
