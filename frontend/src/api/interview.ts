import { apiRequest } from './client'
import type { InterviewReport } from '../types'

interface GenerateReportResponse {
  message: string
  interviewReport: InterviewReport
  voiceText: string
}

export function generateInterviewReport(formData: FormData) {
  return apiRequest<GenerateReportResponse>('/api/interview/', {
    method: 'POST',
    body: formData,
  })
}
