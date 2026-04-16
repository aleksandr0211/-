'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const notAdmin = searchParams.get('error') === 'not_admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Неверный email или пароль')
        setLoading(false)
        return
      }

      if (!data.user?.user_metadata?.is_admin) {
        setError('У вас нет прав администратора')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Произошла ошибка при входе')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            AROMATIC
          </CardTitle>
          <CardDescription>
            Вход в админ-панель
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(error || notAdmin) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || 'У вас нет прав администратора'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>

            <Button 
              type="submit" 
              className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? <Spinner className="mr-2" /> : null}
              Войти
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Для создания администратора используйте Supabase Dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
