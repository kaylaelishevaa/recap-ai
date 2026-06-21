import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <AlertTriangle className="w-10 h-10 text-[#BEF264]" strokeWidth={1.5} />
      <p className="text-[#9A8FAE] max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4A4060] hover:border-[#BEF264] text-[#ECE7F1] hover:text-[#BEF264] text-sm font-medium transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
          Try Again
        </button>
      )}
    </div>
  )
}
