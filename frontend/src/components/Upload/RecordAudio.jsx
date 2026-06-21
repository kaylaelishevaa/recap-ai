import { useEffect } from 'react'
import { Mic, Pause, Square, Play, RotateCcw } from 'lucide-react'
import useAudioRecorder from '../../hooks/useAudioRecorder'

const MAX_SECONDS = 20 * 60
const WARNING_AT = 18 * 60

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function RecordAudio({ onSubmit, isLoading }) {
  const { isRecording, isPaused, elapsed, audioBlob, start, pause, resume, stop, reset } =
    useAudioRecorder()

  // Auto-stop at 20 minutes
  useEffect(() => {
    if (isRecording && elapsed >= MAX_SECONDS) {
      stop()
    }
  }, [isRecording, elapsed, stop])

  const showWarning = isRecording && elapsed >= WARNING_AT && elapsed < MAX_SECONDS
  const hitLimit = !isRecording && audioBlob && elapsed >= MAX_SECONDS

  function handleSubmit() {
    if (audioBlob) {
      const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
      onSubmit(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      {/* Timer */}
      <div className={`text-5xl font-light tracking-wide tabular-nums ${showWarning ? 'text-[#F4737A]' : 'text-[#ECE7F1]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        {formatTime(elapsed)}
      </div>

      {showWarning && (
        <p className="text-[13px] text-[#F4737A] -mt-4">Recording will stop in {formatTime(MAX_SECONDS - elapsed)}</p>
      )}

      {/* Mic button */}
      {!isRecording && !audioBlob && (
        <button
          onClick={start}
          className="w-20 h-20 rounded-full bg-[#BEF264] hover:bg-[#A3E635] flex items-center justify-center transition-all duration-200 shadow-[0_4px_16px_rgba(190,242,100,0.25)]"
        >
          <Mic className="w-8 h-8 text-[#15101C]" strokeWidth={1.5} />
        </button>
      )}

      {isRecording && (
        <div className="flex items-center gap-5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4737A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F4737A]" />
          </span>

          {isPaused ? (
            <button
              onClick={resume}
              className="w-12 h-12 rounded-full border border-[#4A4060] hover:border-[#BEF264] flex items-center justify-center transition-all duration-200"
            >
              <Play className="w-5 h-5 text-[#ECE7F1]" strokeWidth={1.5} />
            </button>
          ) : (
            <button
              onClick={pause}
              className="w-12 h-12 rounded-full border border-[#4A4060] hover:border-[#BEF264] flex items-center justify-center transition-all duration-200"
            >
              <Pause className="w-5 h-5 text-[#ECE7F1]" strokeWidth={1.5} />
            </button>
          )}

          <button
            onClick={stop}
            className="w-12 h-12 rounded-full bg-[#F4737A] hover:bg-[#E0606A] flex items-center justify-center transition-all duration-200"
          >
            <Square className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="flex flex-col items-center gap-5 w-full max-w-sm">
          <p className="text-[13px] text-[#7E748F]">
            {hitLimit ? 'Maximum recording length reached' : `Recording complete — ${formatTime(elapsed)}`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="py-3 px-6 rounded-lg text-sm font-medium text-[#ECE7F1] border border-[#4A4060] hover:border-[#BEF264] hover:text-[#BEF264] flex items-center gap-2 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} /> Re-record
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="py-3 px-6 rounded-lg text-sm font-medium text-[#15101C] uppercase tracking-[0.05em] bg-[#BEF264] hover:bg-[#A3E635] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              Generate Notes
            </button>
          </div>
        </div>
      )}

      {!isRecording && !audioBlob && (
        <div className="text-center">
          <p className="text-[13px] text-[#7E748F]">Click the microphone to start recording</p>
          <p className="text-[11px] text-[#4A4060] mt-1">Maximum 20 minutes</p>
        </div>
      )}
    </div>
  )
}
