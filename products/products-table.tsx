'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Product, Category } from '@/lib/types'

interface ProductsTableProps {
  products: (Product & { categories: { name: string } | null })[]
  categories: Category[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Ошибка при удалении товара')
    } else {
      toast.success('Товар удален')
      router.refresh()
    }

    setDeleteId(null)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Товар
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Категория
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Цена
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Статус
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-secondary/30 rounded flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-primary/40">A</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            {product.brand && (
                              <p className="text-sm text-muted-foreground">
                                {product.brand}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {product.categories?.name || '-'}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.old_price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatPrice(product.old_price)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {product.in_stock ? (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                              В наличии
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                              Нет в наличии
                            </Badge>
                          )}
                          {product.is_featured && (
                            <Badge variant="secondary">
                              Популярное
                            </Badge>
                          )}
                          {product.is_new && (
                            <Badge className="bg-primary text-primary-foreground">
                              Новинка
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Редактировать
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setDeleteId(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Товары не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
