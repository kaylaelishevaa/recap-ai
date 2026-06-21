import { Loader2, CheckCircle2, AudioLines, Brain, FileText } from 'lucide-react'

const steps = [
  { label: 'Transcribing audio...', icon: AudioLines },
  { label: 'Analyzing conversation...', icon: Brain },
  { label: 'Generating notes...', icon: FileText },
]

export default function LoadingState({ step = 1, hasFile = true }) {
  const visibleSteps = hasFile ? steps : steps.slice(1)

  return (
    <div className="max-w-sm mx-auto py-24 flex flex-col items-center gap-8">
      <Loader2 className="w-10 h-10 text-[#BEF264] animate-spin" strokeWidth={1.5} />
      <div className="space-y-3 w-full">
        {visibleSteps.map(({ label, icon: Icon }, i) => {
          const stepNum = hasFile ? i + 1 : i + 2
          const isActive = step === stepNum
          const isDone = step > stepNum

          return (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-[#BEF264]/8 text-[#BEF264]' : isDone ? 'text-[#5FD68A]' : 'text-[#4A4060]'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
              )}
              <span className="text-sm font-medium">{label}</span>
            </div>
          )
        })}
      </div>
      <p className="text-[13px] text-[#7E748F]">This may take a moment...</p>
    </div>
  )
}
