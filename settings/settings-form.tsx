'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { SiteSettings } from '@/lib/types'

interface SettingsFormProps {
  settings: SiteSettings
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(settings)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    const updates = Object.entries(formData).map(([key, value]) => ({
      key,
      value: value || null,
      updated_at: new Date().toISOString()
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(update, { onConflict: 'key' })
      
      if (error) {
        toast.error(`Ошибка при сохранении ${update.key}`)
        setLoading(false)
        return
      }
    }

    toast.success('Настройки сохранены')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Общие настройки</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="site_name">Название сайта</FieldLabel>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="site_description">Описание сайта</FieldLabel>
                <Textarea
                  id="site_description"
                  value={formData.site_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
                  rows={3}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="phone">Телефон</FieldLabel>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="telegram">Telegram</FieldLabel>
                <Input
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                  placeholder="@username"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Адрес</FieldLabel>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="working_hours">Режим работы</FieldLabel>
                <Input
                  id="working_hours"
                  value={formData.working_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, working_hours: e.target.value }))}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <Button
        type="submit"
        className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? <Spinner className="mr-2" /> : null}
        Сохранить настройки
      </Button>
    </form>
  )
}
