import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Brain,
  MessageSquare,
  Mic2,
  Target,
} from 'lucide-react'
import { Button } from '../components/ui/Button'

const features = [
  {
    icon: Brain,
    title: 'AI resume analysis',
    description:
      'Upload your resume and get a match score, skill gaps, and a tailored preparation plan.',
  },
  {
    icon: MessageSquare,
    title: 'Personalized questions',
    description:
      'Technical and behavioral questions generated from your profile and the job description.',
  },
  {
    icon: Mic2,
    title: 'Voice mock interviews',
    description:
      'Practice out loud with speech-to-text feedback and AI scoring on every answer.',
  },
  {
    icon: BarChart3,
    title: 'Actionable feedback',
    description:
      'Scores, strengths, improvements, and model answers so you know exactly what to fix.',
  },
]

export function Landing() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent-hover">
            <Target className="h-4 w-4" />
            AI-powered interview prep
          </div>
          <h1 className="font-display text-5xl leading-tight tracking-tight text-white sm:text-6xl">
            Ace your next interview with{' '}
            <span className="italic text-accent-hover">confidence</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Analyze your resume against any role, get a custom study plan, and
            practice with voice-driven mock interviews — all powered by AI.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Start free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="glass rounded-2xl p-5 transition hover:border-accent/30"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent-hover">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface-elevated/50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl text-white">
            Ready to practice?
          </h2>
          <p className="mt-3 text-slate-400">
            Create an account, verify your email, and generate your first report
            in minutes.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg">Create account</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
