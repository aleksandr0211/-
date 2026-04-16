'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  Image, 
  Settings, 
  LogOut,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/categories', label: 'Категории', icon: FolderOpen },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
  { href: '/admin/banners', label: 'Баннеры', icon: Image },
  { href: '/admin/pages', label: 'Страницы', icon: FileText },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin" className="text-xl font-bold text-sidebar-primary">
          AROMATIC
        </Link>
        <p className="text-sm text-sidebar-foreground/60 mt-1">
          Админ-панель
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-primary' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link 
          href="/" 
          className="block text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground mb-4 px-4"
        >
          Перейти на сайт
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Выйти
        </Button>
      </div>
    </aside>
  )
}
