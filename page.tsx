import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, FolderOpen, ShoppingCart, Image } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { count: bannersCount }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('banners').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    { 
      label: 'Товары', 
      value: productsCount || 0, 
      icon: Package, 
      href: '/admin/products',
      color: 'text-blue-500' 
    },
    { 
      label: 'Категории', 
      value: categoriesCount || 0, 
      icon: FolderOpen, 
      href: '/admin/categories',
      color: 'text-green-500' 
    },
    { 
      label: 'Заказы', 
      value: ordersCount || 0, 
      icon: ShoppingCart, 
      href: '/admin/orders',
      color: 'text-yellow-500' 
    },
    { 
      label: 'Баннеры', 
      value: bannersCount || 0, 
      icon: Image, 
      href: '/admin/banners',
      color: 'text-purple-500' 
    },
  ]

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Дашборд
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Последние заказы
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Заказов пока нет
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
