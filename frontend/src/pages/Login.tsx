import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import * as authApi from '../api/auth'
import { ApiRequestError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/dashboard'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const username = form.get('username') as string
    const email = form.get('email') as string
    const password = form.get('password') as string

    try {
      const res = await authApi.login({ username, email, password })
      setUser(res.user)
      navigate(from, { replace: true })
    } catch (err) {
      const msg =
        err instanceof ApiRequestError ? err.message : 'Login failed.'
      if (msg.toLowerCase().includes('not verified')) {
        setError('Please verify your email before signing in.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <Card title="Welcome back" subtitle="Sign in with your username and email">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <Input label="Username" name="username" required autoComplete="username" />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" loading={loading}>
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-medium text-accent-hover hover:underline">
            Create account
          </Link>
        </p>
      </Card>
    </div>
  )
}
