import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

export default function TranscriptCard({ transcript, language = 'en' }) {
  // Hooks must run unconditionally on every render — keep them above any early
  // return so hook order stays stable when `transcript` is missing.
  const [expanded, setExpanded] = useState(false)
  const [search, setSearch] = useState('')

  if (!transcript) return null

  const isId = language === 'id'

  function highlightText(text) {
    if (!search.trim()) return text
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#BEF264]/20 text-[#ECE7F1] rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="bg-[#1F1828] border border-[#322843] rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="border-l-[3px] border-[#BEF264] pl-3">
          {isId ? 'Transkrip Mentah' : 'Transcript'}
        </h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-[#7E748F]" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#7E748F]" strokeWidth={1.5} />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E748F]" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isId ? 'Cari transkrip...' : 'Search transcript...'}
              className="w-full bg-[#15101C] border border-[#322843] rounded-lg pl-9 pr-3 py-2 text-sm text-[#ECE7F1] placeholder-[#7E748F] focus:outline-none focus:border-[#BEF264] transition-all duration-200"
            />
          </div>
          <div className="max-h-96 overflow-y-auto text-sm text-[#9A8FAE] leading-[1.8] whitespace-pre-wrap bg-[#15101C] rounded-lg p-4 border border-[#2A2236]">
            {highlightText(transcript)}
          </div>
        </div>
      )}
    </div>
  )
}
