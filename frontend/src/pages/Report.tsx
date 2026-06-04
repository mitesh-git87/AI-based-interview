import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  ListChecks,
  Mic2,
  Target,
} from 'lucide-react'
import type { InterviewReport } from '../types'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { VoicePlayer } from '../components/VoicePlayer'

function severityVariant(
  severity: string,
): 'success' | 'warning' | 'danger' | 'default' {
  if (severity === 'low') return 'success'
  if (severity === 'medium') return 'warning'
  if (severity === 'high') return 'danger'
  return 'default'
}

export function Report() {
  const { reportId } = useParams<{ reportId: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<InterviewReport | null>(null)

  useEffect(() => {
    if (!reportId) return
    const stored = sessionStorage.getItem(`report:${reportId}`)
    if (stored) {
      try {
        setReport(JSON.parse(stored) as InterviewReport)
      } catch {
        setReport(null)
      }
    }
  }, [reportId])

  if (!report) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-400">
          Report not found in this session. Generate a new one from the dashboard.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    )
  }

  const score = report.matchScore ?? 0
  const scoreColor =
    score >= 75 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-danger'

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Interview report</p>
          <h1 className="font-display mt-1 text-3xl text-white">Your analysis</h1>
        </div>
        <Button
          size="lg"
          onClick={() => navigate(`/mock-interview/${report._id}`)}
        >
          <Mic2 className="h-5 w-5" />
          Start mock interview
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1 text-center">
          <p className="text-sm text-slate-400">Match score</p>
          <p className={`mt-2 text-5xl font-bold ${scoreColor}`}>{score}%</p>
        </Card>
        <Card className="sm:col-span-2" title="Quick listen">
          <VoicePlayer
            text={`Your resume match score is ${score} percent. Review skill gaps and practice the interview questions below.`}
            label="Hear summary"
          />
        </Card>
      </div>

      {report.skillGap && report.skillGap.length > 0 && (
        <Card className="mb-6" title="Skill gaps" subtitle="Areas to improve before the interview">
          <ul className="space-y-3">
            {report.skillGap.map((gap) => (
              <li
                key={gap.skill}
                className="flex items-center justify-between rounded-xl bg-surface-elevated px-4 py-3"
              >
                <span className="font-medium text-white">{gap.skill}</span>
                <Badge variant={severityVariant(gap.severity)}>
                  {gap.severity}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {report.preparationPlan && report.preparationPlan.length > 0 && (
        <Card
          className="mb-6"
          title="Preparation plan"
          subtitle="Day-by-day study roadmap"
        >
          <div className="space-y-4">
            {report.preparationPlan.map((day) => (
              <div
                key={day.day}
                className="rounded-xl border border-border bg-surface-elevated p-4"
              >
                <div className="flex items-center gap-2 text-accent-hover">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold text-white">Day {day.day}</span>
                  <span className="text-slate-400">— {day.focus}</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {day.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Technical questions">
          <div className="space-y-4">
            {(report.technicalQuestion ?? []).map((q, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/80 bg-surface-elevated p-4"
              >
                <p className="font-medium text-white">{q.question}</p>
                {q.intention && (
                  <p className="mt-2 text-xs text-slate-500">
                    Intent: {q.intention}
                  </p>
                )}
                {q.answer && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    <BookOpen className="mr-1 inline h-3.5 w-3.5" />
                    {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Behavioral questions">
          <div className="space-y-4">
            {(report.behaviourQuestion ?? []).map((q, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/80 bg-surface-elevated p-4"
              >
                <p className="font-medium text-white">{q.question}</p>
                {q.intention && (
                  <p className="mt-2 text-xs text-slate-500">
                    Intent: {q.intention}
                  </p>
                )}
                {q.answer && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-10 flex justify-center">
        <Button size="lg" onClick={() => navigate(`/mock-interview/${report._id}`)}>
          <Mic2 className="h-5 w-5" />
          Practice with mock interview
        </Button>
      </div>
    </div>
  )
}
