import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Star,
  TrendingUp,
} from 'lucide-react'
import {
  getMockSession,
  startMockInterview,
  submitMockAnswer,
} from '../api/mockInterview'
import { ApiRequestError } from '../api/client'
import type { AiFeedback, MockSession } from '../types'
import { AudioRecorder } from '../components/AudioRecorder'
import { Alert } from '../components/ui/Alert'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { VoicePlayer } from '../components/VoicePlayer'

type Phase = 'loading' | 'question' | 'submitting' | 'feedback' | 'completed' | 'error'

export function MockInterview() {
  const { reportId } = useParams<{ reportId: string }>()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [questionType, setQuestionType] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [voiceText, setVoiceText] = useState('')
  const [lastFeedback, setLastFeedback] = useState<AiFeedback | null>(null)
  const [lastTranscript, setLastTranscript] = useState('')
  const [mockSession, setMockSession] = useState<MockSession | null>(null)

  const initSession = useCallback(async () => {
    if (!reportId) return
    setPhase('loading')
    setError(null)

    const existingSessionId = sessionStorage.getItem(`mockSession:${reportId}`)

    if (existingSessionId) {
      try {
        const res = await getMockSession(existingSessionId)
        const session = res.mockSession
        setSessionId(session._id)
        setMockSession(session)
        setTotalQuestions(session.totalQuestions)
        setQuestionIndex(session.currentQuestionIndex)

        if (session.status === 'completed') {
          setPhase('completed')
          return
        }

        const report =
          typeof session.interviewReport === 'object'
            ? session.interviewReport
            : null

        if (report) {
          const technical = (report.technicalQuestion ?? []).map((q) => ({
            question: q.question,
            questionType: 'technical',
          }))
          const behaviour = (report.behaviourQuestion ?? []).map((q) => ({
            question: q.question,
            questionType: 'behaviour',
          }))
          const all = [...technical, ...behaviour]
          const current = all[session.currentQuestionIndex]
          if (current) {
            setCurrentQuestion(current.question)
            setQuestionType(current.questionType)
            setPhase('question')
            return
          }
        }
      } catch {
        sessionStorage.removeItem(`mockSession:${reportId}`)
      }
    }

    try {
      const res = await startMockInterview(reportId)
      setSessionId(res.sessionId)
      sessionStorage.setItem(`mockSession:${reportId}`, res.sessionId)
      setCurrentQuestion(res.currentQuestion)
      setQuestionType(res.currentQuestionType)
      setQuestionIndex(res.currentQuestionIndex)
      setTotalQuestions(res.totalQuestions)
      setVoiceText(res.voiceText)
      setPhase('question')
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Could not start mock interview.',
      )
      setPhase('error')
    }
  }, [reportId])

  useEffect(() => {
    initSession()
  }, [initSession])

  const handleRecorded = async (audio: Blob) => {
    if (!sessionId) return
    setPhase('submitting')
    setError(null)

    try {
      const res = await submitMockAnswer(sessionId, audio)
      setLastFeedback(res.aiFeedback)
      setLastTranscript(res.userTranscript)
      setMockSession(res.mockSession)
      setVoiceText(res.voiceText)

      if (res.isCompleted) {
        setPhase('completed')
        return
      }

      setCurrentQuestion(res.nextQuestion ?? '')
      setQuestionType(res.nextQuestionType ?? '')
      setQuestionIndex(res.nextQuestionIndex)
      setPhase('feedback')
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Failed to submit answer.',
      )
      setPhase('question')
    }
  }

  const continueToNext = () => {
    setLastFeedback(null)
    setLastTranscript('')
    setPhase('question')
  }

  const progress =
    totalQuestions > 0
      ? Math.round((questionIndex / totalQuestions) * 100)
      : 0

  if (phase === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Alert type="error" message={error ?? 'Something went wrong'} />
        <Link to={`/report/${reportId}`} className="mt-6 inline-block">
          <Button variant="secondary">Back to report</Button>
        </Link>
      </div>
    )
  }

  if (phase === 'completed') {
    const avg = mockSession?.averageScore ?? 0
    const total = mockSession?.totalScore ?? 0

    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Card className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <h1 className="font-display mt-6 text-3xl text-white">
            Interview complete!
          </h1>
          <p className="mt-3 text-slate-400">
            Great job finishing all {totalQuestions} questions.
          </p>
          <div className="mt-8 flex justify-center gap-8">
            <div>
              <p className="text-sm text-slate-500">Total score</p>
              <p className="text-2xl font-bold text-white">{total}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Average</p>
              <p className="text-2xl font-bold text-accent-hover">
                {avg.toFixed(1)}/10
              </p>
            </div>
          </div>

          {mockSession?.answers && mockSession.answers.length > 0 && (
            <div className="mt-10 space-y-4 text-left">
              <h2 className="font-semibold text-white">Your answers</h2>
              {mockSession.answers.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-surface-elevated p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">{a.question}</p>
                    <Badge variant="accent">{a.aiScore}/10</Badge>
                  </div>
                  {a.feedbackSummary && (
                    <p className="mt-2 text-sm text-slate-400">{a.feedbackSummary}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/dashboard')}>New report</Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/report/${reportId}`)}
            >
              View report
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        to={`/report/${reportId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to report
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-slate-400">
          <span>
            Question {Math.min(questionIndex + 1, totalQuestions)} of{' '}
            {totalQuestions}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {phase === 'feedback' && lastFeedback && (
        <Card className="mb-6" title="AI feedback">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20">
              <Star className="h-7 w-7 text-accent-hover" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                {lastFeedback.score ?? 0}/10
              </p>
              <p className="text-sm text-slate-400">Answer score</p>
            </div>
          </div>

          {lastTranscript && (
            <p className="mb-4 rounded-xl bg-surface-elevated p-3 text-sm italic text-slate-300">
              &ldquo;{lastTranscript}&rdquo;
            </p>
          )}

          {lastFeedback.feedbackSummary && (
            <p className="mb-4 text-slate-300">{lastFeedback.feedbackSummary}</p>
          )}

          {lastFeedback.goodPoints && lastFeedback.goodPoints.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-semibold uppercase text-success">
                Strengths
              </p>
              <ul className="list-inside list-disc text-sm text-slate-300">
                {lastFeedback.goodPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {lastFeedback.improvements && lastFeedback.improvements.length > 0 && (
            <div className="mb-4">
              <p className="mb-1 text-xs font-semibold uppercase text-warning">
                Improve
              </p>
              <ul className="list-inside list-disc text-sm text-slate-300">
                {lastFeedback.improvements.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {lastFeedback.betterAnswer && (
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-slate-300">
              <TrendingUp className="mb-2 h-4 w-4 text-accent-hover" />
              <strong className="text-white">Model answer: </strong>
              {lastFeedback.betterAnswer}
            </div>
          )}

          {voiceText && (
            <div className="mt-4">
              <VoicePlayer text={voiceText} autoPlay label="Hear feedback" />
            </div>
          )}

          <Button className="mt-6 w-full" onClick={continueToNext}>
            Next question
          </Button>
        </Card>
      )}

      {(phase === 'question' || phase === 'submitting') && (
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="accent">{questionType}</Badge>
          </div>
          <h2 className="text-xl font-semibold leading-relaxed text-white">
            {currentQuestion}
          </h2>

          {voiceText && phase === 'question' && questionIndex === 0 && (
            <div className="mt-4">
              <VoicePlayer text={voiceText} autoPlay label="Hear question" />
            </div>
          )}

          <div className="mt-10">
            {phase === 'submitting' ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-slate-400">Evaluating your answer…</p>
              </div>
            ) : (
              <AudioRecorder onRecorded={handleRecorded} />
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
