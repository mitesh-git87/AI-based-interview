export interface User {
  id: string
  username: string
  email: string
  verified?: boolean
}

export interface TechnicalQuestion {
  question: string
  intention?: string
  answer?: string
}

export interface BehaviourQuestion {
  question: string
  intention?: string
  answer?: string
}

export interface SkillGap {
  skill: string
  severity: 'low' | 'medium' | 'high'
}

export interface PreparationPlan {
  day: number
  focus: string
  tasks: string[]
}

export interface InterviewReport {
  _id: string
  matchScore?: number
  jobDescription?: string
  selfDescription?: string
  technicalQuestion?: TechnicalQuestion[]
  behaviourQuestion?: BehaviourQuestion[]
  skillGap?: SkillGap[]
  preparationPlan?: PreparationPlan[]
  user?: string
  createdAt?: string
  updatedAt?: string
}

export interface AiFeedback {
  score?: number
  goodPoints?: string[]
  improvements?: string[]
  missingPoints?: string[]
  betterAnswer?: string
  feedbackSummary?: string
}

export interface MockAnswer {
  question: string
  questionType: 'technical' | 'behaviour'
  userTranscript?: string
  aiScore?: number
  goodPoints?: string[]
  improvements?: string[]
  missingPoints?: string[]
  betterAnswer?: string
  feedbackSummary?: string
  answeredAt?: string
}

export interface MockSession {
  _id: string
  status: 'started' | 'completed'
  currentQuestionIndex: number
  totalQuestions: number
  totalScore?: number
  averageScore?: number
  answers?: MockAnswer[]
  interviewReport?: InterviewReport | string
}

export interface ApiError {
  message: string
  error?: string
}
