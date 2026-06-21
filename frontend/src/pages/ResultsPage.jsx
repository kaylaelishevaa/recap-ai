import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Trash2, Loader2 } from 'lucide-react'
import useMeeting from '../hooks/useMeeting'
import SentimentBadge from '../components/Meeting/SentimentBadge'
import SummaryCard from '../components/Meeting/SummaryCard'
import DecisionsCard from '../components/Meeting/DecisionsCard'
import ActionItemsCard from '../components/Meeting/ActionItemsCard'
import FollowUpsCard from '../components/Meeting/FollowUpsCard'
import TranscriptCard from '../components/Meeting/TranscriptCard'
import ExportMenu from '../components/Common/ExportMenu'
import ErrorState from '../components/Common/ErrorState'
import { deleteMeeting } from '../services/api'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  return `${m} min`
}

const langFlags = { en: '\u{1F1EC}\u{1F1E7}', id: '\u{1F1EE}\u{1F1E9}', mixed: '\u{1F1EC}\u{1F1E7}\u{1F1EE}\u{1F1E9}' }

export default function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { meeting, loading, error, refetch } = useMeeting(id)

  async function handleDelete() {
    if (!confirm('Delete this meeting? This cannot be undone.')) return
    try {
      await deleteMeeting(id)
      navigate('/history')
    } catch {
      // stay on page
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#BEF264] animate-spin" strokeWidth={1.5} />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  if (!meeting) return null

  const lang = meeting.language || 'en'
  const duration = formatDuration(meeting.duration_seconds)

  return (
    <div className="space-y-8">
      {/* Print-only document header (hidden on screen) */}
      <div className="print-only" style={{ marginBottom: '16px', borderBottom: '1px solid #dcdcdc', paddingBottom: '8px' }}>
        <strong>RecapAI</strong> — Meeting Notes
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <button
            onClick={() => navigate('/')}
            className="no-print flex items-center gap-1.5 text-[13px] text-[#7E748F] hover:text-[#ECE7F1] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Back to Home
          </button>
          <h1 className="text-[28px]">{meeting.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#7E748F]">
            <span>{langFlags[lang] || langFlags.en}</span>
            <span>{formatDate(meeting.created_at)}</span>
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> {duration}
              </span>
            )}
            <SentimentBadge sentiment={meeting.sentiment} />
          </div>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2">
          <ExportMenu meetingId={id} language={lang} />
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F4737A]/30 hover:border-[#F4737A] text-[#F4737A] text-sm font-medium transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} /> Delete
          </button>
        </div>
      </div>

      {/* Mixed language info */}
      {lang === 'mixed' && (
        <div className="flex items-start gap-2.5 p-4 rounded-lg bg-[#2A2236] border border-[#322843] text-[13px] text-[#9A8FAE] leading-relaxed">
          <span className="flex-shrink-0 mt-0.5">&#9432;</span>
          This meeting was processed in mixed language mode. Content may appear in both English and Indonesian, reflecting the original discussion.
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SummaryCard summary={meeting.summary} language={lang} />
        <DecisionsCard decisions={meeting.decisions} language={lang} />
        <ActionItemsCard actionItems={meeting.action_items} language={lang} />
        <FollowUpsCard followUps={meeting.follow_ups} language={lang} />
      </div>

      {/* Transcript */}
      <TranscriptCard transcript={meeting.transcript} language={lang} />
    </div>
  )
}
