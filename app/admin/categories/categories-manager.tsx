'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
import type { Category } from '@/lib/types'

interface CategoriesManagerProps {
  categories: Category[]
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editData, setEditData] = useState({ name: '', slug: '', description: '' })
  const [newData, setNewData] = useState({ name: '', slug: '', description: '' })

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

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    const supabase = createClient()
    const { error } = await supabase
      .from('categories')
      .update({
        name: editData.name,
        slug: editData.slug,
        description: editData.description || null
      })
      .eq('id', editingId)

    if (error) {
      toast.error('Ошибка при сохранении')
    } else {
      toast.success('Категория обновлена')
      setEditingId(null)
      router.refresh()
    }
  }

  const handleAdd = async () => {
    if (!newData.name.trim()) return

    const supabase = createClient()
    const { error } = await supabase
      .from('categories')
      .insert({
        name: newData.name,
        slug: newData.slug || generateSlug(newData.name),
        description: newData.description || null,
        sort_order: categories.length
      })

    if (error) {
      toast.error('Ошибка при создании')
    } else {
      toast.success('Категория создана')
      setIsAdding(false)
      setNewData({ name: '', slug: '', description: '' })
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const supabase = createClient()
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Ошибка при удалении')
    } else {
      toast.success('Категория удалена')
      router.refresh()
    }

    setDeleteId(null)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div key={category.id} className="p-4">
                {editingId === category.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ 
                          ...prev, 
                          name: e.target.value,
                          slug: generateSlug(e.target.value)
                        }))}
                        placeholder="Название"
                      />
                      <Input
                        value={editData.slug}
                        onChange={(e) => setEditData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="URL (slug)"
                      />
                      <Input
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Описание"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Check className="h-4 w-4 mr-1" />
                        Сохранить
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 mr-1" />
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-sm text-muted-foreground">/{category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setDeleteId(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isAdding && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    value={newData.name}
                    onChange={(e) => setNewData(prev => ({ 
                      ...prev, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }))}
                    placeholder="Название"
                    autoFocus
                  />
                  <Input
                    value={newData.slug}
                    onChange={(e) => setNewData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="URL (slug)"
                  />
                  <Input
                    value={newData.description}
                    onChange={(e) => setNewData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Описание"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAdd}>
                    <Check className="h-4 w-4 mr-1" />
                    Создать
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!isAdding && (
        <Button
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить категорию
        </Button>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товары останутся без категории.
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
