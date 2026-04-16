'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import type { Page } from '@/lib/types'
import Link from 'next/link'

interface PagesManagerProps {
  pages: Page[]
}

export function PagesManager({ pages }: PagesManagerProps) {
  const router = useRouter()
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    meta_title: '',
    meta_description: ''
  })

  const generateSlug = (title: string) => {
    return title
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

  const openEdit = (page: Page) => {
    setEditingPage(page)
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || ''
    })
  }

  const openAdd = () => {
    setIsAdding(true)
    setFormData({
      slug: '',
      title: '',
      content: '',
      meta_title: '',
      meta_description: ''
    })
  }

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()

    const data = {
      slug: formData.slug || generateSlug(formData.title),
      title: formData.title,
      content: formData.content || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null
    }

    let error
    if (editingPage) {
      const result = await supabase
        .from('pages')
        .update(data)
        .eq('id', editingPage.id)
      error = result.error
    } else {
      const result = await supabase
        .from('pages')
        .insert(data)
      error = result.error
    }

    setLoading(false)

    if (error) {
      toast.error('Ошибка при сохранении')
    } else {
      toast.success(editingPage ? 'Страница обновлена' : 'Страница создана')
      setEditingPage(null)
      setIsAdding(false)
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const supabase = createClient()
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Ошибка при удалении')
    } else {
      toast.success('Страница удалена')
      router.refresh()
    }

    setDeleteId(null)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {pages.length > 0 ? (
            <div className="divide-y divide-border">
              {pages.map((page) => (
                <div key={page.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{page.title}</p>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                    >
                      <Link href={`/${page.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => setDeleteId(page.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Страниц пока нет
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={openAdd}
      >
        <Plus className="h-4 w-4 mr-2" />
        Добавить страницу
      </Button>

      {/* Edit/Add Dialog */}
      <Dialog open={!!editingPage || isAdding} onOpenChange={() => { setEditingPage(null); setIsAdding(false); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? 'Редактировать страницу' : 'Создать страницу'}
            </DialogTitle>
          </DialogHeader>
          
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Заголовок</FieldLabel>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  title: e.target.value,
                  slug: editingPage ? prev.slug : generateSlug(e.target.value)
                }))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">URL (slug)</FieldLabel>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="content">Содержимое</FieldLabel>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="meta_title">Meta Title</FieldLabel>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="meta_description">Meta Description</FieldLabel>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                rows={2}
              />
            </Field>
          </FieldGroup>

          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => { setEditingPage(null); setIsAdding(false); }}
            >
              Отмена
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Spinner className="mr-2" /> : null}
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить страницу?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
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
