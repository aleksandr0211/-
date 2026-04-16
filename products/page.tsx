import { createClient } from '@/lib/supabase/server'
import { ProductsTable } from './products-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('sort_order')

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Товары
        </h1>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Link>
        </Button>
      </div>

      <ProductsTable products={products || []} categories={categories || []} />
    </div>
  )
}
