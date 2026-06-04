import { apiRequest } from './client'
import type { AiFeedback, MockSession } from '../types'

interface StartMockResponse {
  message: string
  sessionId: string
  reportId: string
  currentQuestionIndex: number
  totalQuestions: number
  currentQuestion: string
  currentQuestionType: string
  voiceText: string
}

interface AnswerMockResponse {
  message: string
  sessionId: string
  questionIndex: number
  question: string
  questionType: string
  userTranscript: string
  aiFeedback: AiFeedback
  nextQuestionIndex: number
  nextQuestion: string | null
  nextQuestionType: string | null
  isCompleted: boolean
  mockSession: MockSession
  voiceText: string
}

interface SessionResponse {
  message: string
  mockSession: MockSession
}

export function startMockInterview(reportId: string) {
  return apiRequest<StartMockResponse>(
    `/api/mock-interview/start/${reportId}`,
  )
}

export function submitMockAnswer(sessionId: string, audio: Blob) {
  const formData = new FormData()
  formData.append('answerAudio', audio, 'answer.webm')

  return apiRequest<AnswerMockResponse>(
    `/api/mock-interview/answer/${sessionId}`,
    {
      method: 'POST',
      body: formData,
    },
  )
}

export function getMockSession(sessionId: string) {
  return apiRequest<SessionResponse>(
    `/api/mock-interview/session/${sessionId}`,
  )
}
