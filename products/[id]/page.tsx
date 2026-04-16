import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductForm } from './product-form'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const isNew = id === 'new'

  let product = null
  if (!isNew) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (!data) {
      notFound()
    }
    product = data
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isNew ? 'Добавить товар' : 'Редактировать товар'}
      </h1>

      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
