import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUp, Sparkles } from 'lucide-react'
import { generateInterviewReport } from '../api/interview'
import { ApiRequestError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Textarea } from '../components/ui/Input'
import { VoicePlayer } from '../components/VoicePlayer'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [voiceText, setVoiceText] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setVoiceText(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const file = fileRef.current?.files?.[0]

    if (!file) {
      setError('Please upload your resume (PDF, max 3MB).')
      setLoading(false)
      return
    }

    if (file.type !== 'application/pdf') {
      setError('Resume must be a PDF file.')
      setLoading(false)
      return
    }

    const uploadData = new FormData()
    uploadData.append('resume', file)
    uploadData.append('selfDescription', form.get('selfDescription') as string)
    uploadData.append('jobDescription', form.get('jobDescription') as string)

    try {
      const res = await generateInterviewReport(uploadData)
      setVoiceText(res.voiceText)
      sessionStorage.setItem(
        `report:${res.interviewReport._id}`,
        JSON.stringify(res.interviewReport),
      )
      navigate(`/report/${res.interviewReport._id}`)
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Failed to generate report. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white">
          Hello, {user?.username}
        </h1>
        <p className="mt-2 text-slate-400">
          Upload your resume and job details to get an AI interview report.
        </p>
      </div>

      <Card
        title="Generate interview report"
        subtitle="PDF resume up to 3MB · powered by Gemini"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert type="error" message={error} />}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">
              Resume (PDF)
            </label>
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-elevated px-6 py-10 transition hover:border-accent/40"
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <FileUp className="mb-3 h-10 w-10 text-accent-hover" />
              <p className="text-sm font-medium text-white">
                {fileName ?? 'Click to upload PDF'}
              </p>
              <p className="mt-1 text-xs text-slate-500">Maximum 3MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) =>
                setFileName(e.target.files?.[0]?.name ?? null)
              }
            />
          </div>

          <Textarea
            label="About you"
            name="selfDescription"
            required
            placeholder="Brief summary of your experience, strengths, and career goals…"
            rows={4}
          />

          <Textarea
            label="Job description"
            name="jobDescription"
            required
            placeholder="Paste the full job posting or role requirements…"
            rows={5}
          />

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            <Sparkles className="h-5 w-5" />
            Generate report
          </Button>
        </form>

        {voiceText && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-3 text-sm text-slate-400">Report summary (audio)</p>
            <VoicePlayer text={voiceText} autoPlay />
          </div>
        )}
      </Card>
    </div>
  )
}
