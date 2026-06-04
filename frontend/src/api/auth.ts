import { apiRequest } from './client'
import type { User } from '../types'

interface AuthResponse {
  message: string
  user: User
}

export function register(data: {
  username: string
  email: string
  password: string
}) {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(data: {
  username: string
  email: string
  password: string
}) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function logout() {
  return apiRequest<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  })
}

export function getMe() {
  return apiRequest<AuthResponse>('/api/auth/getme')
}

export function verifyEmail(data: { otp: string; email: string }) {
  return apiRequest<AuthResponse>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
