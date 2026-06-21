import { useState, useRef, useCallback, useEffect } from 'react'

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    chunksRef.current = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      setAudioBlob(blob)
      stream.getTracks().forEach((t) => t.stop())
    }

    mediaRecorderRef.current = recorder
    recorder.start(1000)
    setIsRecording(true)
    setIsPaused(false)
    setAudioBlob(null)
    setElapsed(0)
    startTimer()
  }, [startTimer])

  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      stopTimer()
    }
  }, [stopTimer])

  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      startTimer()
    }
  }, [startTimer])

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    setIsPaused(false)
    stopTimer()
  }, [stopTimer])

  const reset = useCallback(() => {
    setAudioBlob(null)
    setElapsed(0)
    setIsRecording(false)
    setIsPaused(false)
  }, [])

  return { isRecording, isPaused, elapsed, audioBlob, start, pause, resume, stop, reset }
}
