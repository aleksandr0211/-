'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Send, Check } from 'lucide-react'

interface ContactFormProps {
  telegram: string
}

export function ContactForm({ telegram }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const message = `Здравствуйте!\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\n\nСообщение:\n${formData.message}`
    
    window.open(
      `https://t.me/${telegram.replace('@', '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
    
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', phone: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  if (submitted) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Спасибо за обращение!
          </h3>
          <p className="text-muted-foreground">
            Telegram откроется в новом окне
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Напишите нам</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Ваше имя *</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Телефон *</FieldLabel>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="message">Сообщение</FieldLabel>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                placeholder="Ваш вопрос или пожелание..."
              />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#0088cc] hover:bg-[#0077b5] text-white"
          >
            <Send className="mr-2 h-4 w-4" />
            Отправить через Telegram
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
