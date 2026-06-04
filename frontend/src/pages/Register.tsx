import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import * as authApi from '../api/auth'
import { ApiRequestError } from '../api/client'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const username = form.get('username') as string
    const email = form.get('email') as string
    const password = form.get('password') as string

    try {
      await authApi.register({ username, email, password })
      navigate('/verify-email', { state: { email } })
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Registration failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <Card title="Create your account" subtitle="We'll send a verification code to your email">
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
            minLength={6}
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full" loading={loading}>
            <UserPlus className="h-4 w-4" />
            Register
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent-hover hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
