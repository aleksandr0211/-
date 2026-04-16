import { createClient } from '@/lib/supabase/server'
import { OrdersTable } from './orders-table'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Заказы
      </h1>

      <OrdersTable orders={orders || []} />
    </div>
  )
}
