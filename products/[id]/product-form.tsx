'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Product, Category } from '@/lib/types'

interface ProductFormProps {
  product: Product | null
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price?.toString() || '',
    old_price: product?.old_price?.toString() || '',
    category_id: product?.category_id || '',
    brand: product?.brand || '',
    volume: product?.volume || '',
    image_url: product?.image_url || '',
    in_stock: product?.in_stock ?? true,
    is_featured: product?.is_featured ?? false,
    is_new: product?.is_new ?? false,
    sort_order: product?.sort_order?.toString() || '0',
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[а-яё]/gi, (char) => {
        const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
        const en = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sch','','y','','e','yu','ya']
        const index = ru.indexOf(char.toLowerCase())
        return index >= 0 ? en[index] : char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: product ? prev.slug : generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    const data = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      short_description: formData.short_description || null,
      price: parseFloat(formData.price),
      old_price: formData.old_price ? parseFloat(formData.old_price) : null,
      category_id: formData.category_id || null,
      brand: formData.brand || null,
      volume: formData.volume || null,
      image_url: formData.image_url || null,
      in_stock: formData.in_stock,
      is_featured: formData.is_featured,
      is_new: formData.is_new,
      sort_order: parseInt(formData.sort_order) || 0,
    }

    let error
    if (product) {
      const result = await supabase
        .from('products')
        .update(data)
        .eq('id', product.id)
      error = result.error
    } else {
      const result = await supabase
        .from('products')
        .insert(data)
      error = result.error
    }

    setLoading(false)

    if (error) {
      toast.error('Ошибка при сохранении')
      return
    }

    toast.success(product ? 'Товар обновлен' : 'Товар создан')
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Название *</FieldLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="slug">URL (slug) *</FieldLabel>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="short_description">Краткое описание</FieldLabel>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Полное описание</FieldLabel>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={5}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Цена и характеристики</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="price">Цена *</FieldLabel>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="old_price">Старая цена</FieldLabel>
                    <Input
                      id="old_price"
                      type="number"
                      step="0.01"
                      value={formData.old_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, old_price: e.target.value }))}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="brand">Бренд</FieldLabel>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="volume">Объем</FieldLabel>
                    <Input
                      id="volume"
                      value={formData.volume}
                      onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                      placeholder="100 мл"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Изображение</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="image_url">URL изображения</FieldLabel>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </Field>
              {formData.image_url && (
                <div className="mt-4 w-32 h-32 bg-secondary/30 rounded overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Категория</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">В наличии</span>
                <Switch
                  checked={formData.in_stock}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, in_stock: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Популярный товар</span>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Новинка</span>
                <Switch
                  checked={formData.is_new}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_new: checked }))}
                />
              </div>

              <Field>
                <FieldLabel htmlFor="sort_order">Порядок сортировки</FieldLabel>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                />
              </Field>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? <Spinner className="mr-2" /> : null}
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
