import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { Button } from './ui/Button'

interface AudioRecorderProps {
  onRecorded: (blob: Blob) => void
  disabled?: boolean
}

export function AudioRecorder({ onRecorded, disabled }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    setError(null)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: mimeType })
        if (blob.size > 0) onRecorded(blob)
        setRecording(false)
      }

      recorder.start()
      setRecording(true)
    } catch {
      setError('Microphone access denied. Please allow microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={recording ? stopRecording : startRecording}
          className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all ${
            recording
              ? 'recording-pulse bg-danger text-white'
              : 'bg-accent text-white shadow-xl shadow-accent/40 hover:bg-accent-hover'
          } disabled:opacity-50`}
        >
          {recording ? (
            <Square className="h-8 w-8 fill-current" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </button>
      </div>
      <p className="text-sm text-slate-400">
        {recording ? 'Recording… tap to stop' : 'Tap to record your answer'}
      </p>
      {recording && (
        <Button variant="danger" size="sm" onClick={stopRecording}>
          Stop recording
        </Button>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
