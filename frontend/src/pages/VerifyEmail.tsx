import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import * as authApi from '../api/auth'
import { ApiRequestError } from '../api/client'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const presetEmail = (location.state as { email?: string })?.email ?? ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const otp = form.get('otp') as string

    try {
      await authApi.verifyEmail({ email, otp })
      setSuccess('Email verified! You can now sign in.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Verification failed. Check your OTP.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <Card
        title="Verify your email"
        subtitle="Demo mode — email service is temporarily disabled"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <Input
            label="Email"
            name="email"
            type="email"
            required
            defaultValue={presetEmail}
          />

          <Input
            label="OTP code"
            name="otp"
            required
            placeholder="6-digit code"
            autoComplete="one-time-code"
            defaultValue="123456"   // 👈 pre-fills OTP for demo
          />

          {/* 👇 Demo OTP notice */}
          <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
            📌 <strong>Use 123456 as OTP</strong> <br />
            Our email service is temporarily unavailable, so OTP delivery is disabled.
            Please use the OTP shown above to verify your account.
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            <MailCheck className="h-4 w-4" />
            Verify email
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="font-medium text-accent-hover hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
