'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Menu, X, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/lib/cart-store'
import type { Category, SiteSettings } from '@/lib/types'

interface HeaderProps {
  categories: Category[]
  settings: SiteSettings
}

export function Header({ categories, settings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const itemsCount = useCartStore((state) => state.getItemsCount())

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-border/40">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
            <span>{settings.working_hours}</span>
          </div>
          <a 
            href={`https://t.me/${settings.telegram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Send className="h-4 w-4" />
            Написать в Telegram
          </a>
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between h-16">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  href="/" 
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Главная
                </Link>
                <Link 
                  href="/catalog" 
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Каталог
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/catalog/${category.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors pl-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link 
                  href="/contacts" 
                  className="text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Контакты
                </Link>
                <div className="pt-4 border-t border-border">
                  <a 
                    href={`tel:${settings.phone}`} 
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-4 w-4" />
                    {settings.phone}
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-wider text-primary">
              {settings.site_name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Главная
            </Link>
            <div className="relative group">
              <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
                Каталог
              </Link>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[200px]">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/catalog/${category.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-secondary hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
              Контакты
            </Link>
          </nav>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-6 w-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemsCount}
                </span>
              )}
              <span className="sr-only">Корзина</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
