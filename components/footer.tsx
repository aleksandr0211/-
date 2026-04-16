import Link from 'next/link'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import type { Category, SiteSettings } from '@/lib/types'

interface FooterProps {
  categories: Category[]
  settings: SiteSettings
}

export function Footer({ categories, settings }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold tracking-wider text-primary">
              {settings.site_name}
            </Link>
            <p className="text-muted-foreground text-sm">
              {settings.site_description}
            </p>
            <a 
              href={`https://t.me/${settings.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
              Написать в Telegram
            </a>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Каталог</h3>
            <nav className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalog/${category.slug}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Информация</h3>
            <nav className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                О нас
              </Link>
              <Link href="/delivery" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Доставка
              </Link>
              <Link href="/contacts" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Контакты
              </Link>
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Контакты</h3>
            <div className="space-y-3">
              <a 
                href={`tel:${settings.phone}`} 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                {settings.phone}
              </a>
              <a 
                href={`mailto:${settings.email}`} 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                {settings.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {settings.address}
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                {settings.working_hours}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {settings.site_name}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
