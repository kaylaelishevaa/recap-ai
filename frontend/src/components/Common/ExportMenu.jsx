import { useState } from 'react'
import { Copy, FileDown, Check } from 'lucide-react'
import { exportMeeting } from '../../services/api'

export default function ExportMenu({ meetingId, language = 'en' }) {
  const [copied, setCopied] = useState(false)

  const isId = language === 'id'

  async function handleCopy() {
    try {
      const { markdown } = await exportMeeting(meetingId)
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }

  function handleSavePdf() {
    // Opens the browser print dialog; the print stylesheet renders a clean,
    // light document, and the user picks "Save as PDF" as the destination.
    window.print()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4A4060] hover:border-[#BEF264] text-sm text-[#ECE7F1] hover:text-[#BEF264] font-medium transition-all duration-200"
      >
        {copied ? <Check className="w-4 h-4 text-[#5FD68A]" strokeWidth={1.5} /> : <Copy className="w-4 h-4" strokeWidth={1.5} />}
        {copied ? (isId ? 'Tersalin!' : 'Copied!') : (isId ? 'Salin Transkrip' : 'Copy Markdown')}
      </button>
      <button
        onClick={handleSavePdf}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#4A4060] hover:border-[#BEF264] text-sm text-[#ECE7F1] hover:text-[#BEF264] font-medium transition-all duration-200"
      >
        <FileDown className="w-4 h-4" strokeWidth={1.5} />
        {isId ? 'Simpan PDF' : 'Save as PDF'}
      </button>
    </div>
  )
}
