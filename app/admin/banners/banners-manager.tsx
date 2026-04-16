'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
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
import type { Banner } from '@/lib/types'

interface BannersManagerProps {
  banners: Banner[]
}

export function BannersManager({ banners }: BannersManagerProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editData, setEditData] = useState({ title: '', subtitle: '', link: '', is_active: true })
  const [newData, setNewData] = useState({ title: '', subtitle: '', link: '', is_active: true })

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id)
    setEditData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      link: banner.link || '',
      is_active: banner.is_active
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    const supabase = createClient()
    const { error } = await supabase
      .from('banners')
      .update({
        title: editData.title,
        subtitle: editData.subtitle || null,
        link: editData.link || null,
        is_active: editData.is_active
      })
      .eq('id', editingId)

    if (error) {
      toast.error('Ошибка при сохранении')
    } else {
      toast.success('Баннер обновлен')
      setEditingId(null)
      router.refresh()
    }
  }

  const handleAdd = async () => {
    if (!newData.title.trim()) return

    const supabase = createClient()
    const { error } = await supabase
      .from('banners')
      .insert({
        title: newData.title,
        subtitle: newData.subtitle || null,
        link: newData.link || null,
        is_active: newData.is_active,
        sort_order: banners.length
      })

    if (error) {
      toast.error('Ошибка при создании')
    } else {
      toast.success('Баннер создан')
      setIsAdding(false)
      setNewData({ title: '', subtitle: '', link: '', is_active: true })
      router.refresh()
    }
  }

  const handleToggleActive = async (id: string, is_active: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('banners')
      .update({ is_active })
      .eq('id', id)

    if (error) {
      toast.error('Ошибка при обновлении')
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const supabase = createClient()
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Ошибка при удалении')
    } else {
      toast.success('Баннер удален')
      router.refresh()
    }

    setDeleteId(null)
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {banners.map((banner) => (
              <div key={banner.id} className="p-4">
                {editingId === banner.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={editData.title}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Заголовок"
                      />
                      <Input
                        value={editData.subtitle}
                        onChange={(e) => setEditData(prev => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Подзаголовок"
                      />
                      <Input
                        value={editData.link}
                        onChange={(e) => setEditData(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="Ссылка"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <Switch
                          checked={editData.is_active}
                          onCheckedChange={(checked) => setEditData(prev => ({ ...prev, is_active: checked }))}
                        />
                        Активен
                      </label>
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
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={banner.is_active}
                        onCheckedChange={(checked) => handleToggleActive(banner.id, checked)}
                      />
                      <div>
                        <p className="font-medium text-foreground">{banner.title}</p>
                        {banner.subtitle && (
                          <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setDeleteId(banner.id)}
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
                    value={newData.title}
                    onChange={(e) => setNewData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Заголовок"
                    autoFocus
                  />
                  <Input
                    value={newData.subtitle}
                    onChange={(e) => setNewData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Подзаголовок"
                  />
                  <Input
                    value={newData.link}
                    onChange={(e) => setNewData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="Ссылка"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={newData.is_active}
                      onCheckedChange={(checked) => setNewData(prev => ({ ...prev, is_active: checked }))}
                    />
                    Активен
                  </label>
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
          Добавить баннер
        </Button>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить баннер?</AlertDialogTitle>
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
