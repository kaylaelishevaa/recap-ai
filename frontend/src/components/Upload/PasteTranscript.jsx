import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { randomSample } from '../../data/sampleTranscripts'

export default function PasteTranscript({ onSubmit, isLoading }) {
  const [text, setText] = useState('')
  const [lastId, setLastId] = useState(null)

  function loadRandomSample() {
    const sample = randomSample(lastId)
    setText(sample.text)
    setLastId(sample.id)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          rows={12}
          className="w-full bg-[#1F1828] border border-[#322843] rounded-xl px-4 py-3 text-[#ECE7F1] text-[15px] placeholder-[#7E748F] resize-y focus:outline-none focus:border-[#BEF264] focus:ring-1 focus:ring-[#BEF264] transition-all duration-200"
        />
        <span className="absolute bottom-3 right-3 text-xs text-[#7E748F]">
          {text.length.toLocaleString()} characters
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          onClick={loadRandomSample}
          className="flex items-center gap-2 text-[13px] text-[#BEF264] hover:text-[#A3E635] transition-colors"
        >
          <Shuffle className="w-4 h-4" strokeWidth={1.5} />
          Load a random sample
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onSubmit(text)}
          disabled={!text.trim() || isLoading}
          className="py-3 px-8 rounded-lg font-medium text-sm text-[#15101C] uppercase tracking-[0.05em] bg-[#BEF264] hover:bg-[#A3E635] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          Generate Notes
        </button>
      </div>
    </div>
  )
}
