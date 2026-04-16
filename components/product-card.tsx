'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/lib/types'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success('Товар добавлен в корзину')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
        <div className="relative aspect-square bg-secondary/30 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-32 bg-gradient-to-b from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <span className="text-4xl text-primary/40">A</span>
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <Badge className="bg-primary text-primary-foreground">
                Новинка
              </Badge>
            )}
            {product.old_price && (
              <Badge variant="destructive">
                Скидка
              </Badge>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            size="icon"
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          {product.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.volume && (
            <p className="text-sm text-muted-foreground mb-2">{product.volume}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>
          {!product.in_stock && (
            <p className="text-sm text-destructive mt-2">Нет в наличии</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
