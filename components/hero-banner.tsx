import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Banner } from '@/lib/types'

interface HeroBannerProps {
  banners: Banner[]
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const mainBanner = banners[0]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
            {mainBanner?.title || 'Мир изысканных ароматов'}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
            {mainBanner?.subtitle || 'Откройте для себя коллекцию элитной парфюмерии от лучших мировых брендов'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/catalog">
                Смотреть каталог
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary">
              <Link href="/contacts">
                Связаться с нами
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
