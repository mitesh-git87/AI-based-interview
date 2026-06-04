const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function textToSpeech(text: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}/api/voice/text-to-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(
      (err as { message?: string }).message ?? 'Failed to generate voice',
    )
  }

  return response.blob()
}
