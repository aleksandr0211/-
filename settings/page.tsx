import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './settings-form'
import type { SiteSettings } from '@/lib/types'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*')

  const settings: SiteSettings = {
    site_name: 'AROMATIC',
    site_description: 'Интернет-магазин парфюмерии',
    phone: '+7 (900) 053-32-32',
    email: 'info@aromatic.su',
    telegram: '@aromatic_shop',
    address: 'г. Москва',
    working_hours: 'Пн-Вс: 10:00 - 22:00'
  }

  if (data) {
    data.forEach((item) => {
      if (item.key in settings && item.value) {
        (settings as Record<string, string>)[item.key] = item.value
      }
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Настройки сайта
      </h1>

      <SettingsForm settings={settings} />
    </div>
  )
}
