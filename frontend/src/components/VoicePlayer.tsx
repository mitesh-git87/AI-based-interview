import { useEffect, useRef, useState } from 'react'
import { Loader2, Volume2 } from 'lucide-react'
import { textToSpeech } from '../api/voice'
import { Button } from './ui/Button'

interface VoicePlayerProps {
  text: string
  autoPlay?: boolean
  label?: string
}

export function VoicePlayer({
  text,
  autoPlay = false,
  label = 'Listen',
}: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cleanup = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }

  const play = async () => {
    if (!text?.trim()) return
    setError(null)
    setLoading(true)
    cleanup()

    try {
      const blob = await textToSpeech(text)
      const url = URL.createObjectURL(blob)
      urlRef.current = url
      const audio = new Audio(url)
      audioRef.current = audio
      await audio.play()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice playback failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoPlay && text) {
      play()
    }
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoPlay])

  useEffect(() => () => cleanup(), [])

  if (!text?.trim()) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={play}
        loading={loading}
        disabled={loading}
      >
        {!loading && <Volume2 className="h-4 w-4" />}
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
      </Button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
