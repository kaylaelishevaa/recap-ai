import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import SentimentBadge from '../Meeting/SentimentBadge'

const langFlags = { en: '\u{1F1EC}\u{1F1E7}', id: '\u{1F1EE}\u{1F1E9}', mixed: '\u{1F1EC}\u{1F1E7}\u{1F1EE}\u{1F1E9}' }

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function MeetingCard({ meeting }) {
  const flag = langFlags[meeting.language] || langFlags.en

  return (
    <Link
      to={`/meeting/${meeting.id}`}
      className="group block bg-[#1F1828] border border-[#322843] rounded-xl p-5 hover:border-[#4A4060] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-['Sora'] text-base font-semibold text-[#ECE7F1] line-clamp-1 group-hover:text-[#BEF264] transition-colors">
          {meeting.title}
        </h3>
        <span className="text-sm flex-shrink-0" title={meeting.language === 'id' ? 'Bahasa Indonesia' : 'English'}>
          {flag}
        </span>
      </div>

      <p className="text-sm text-[#9A8FAE] line-clamp-2 mb-3 leading-relaxed">
        {meeting.summary || 'No summary available'}
      </p>

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-xs text-[#7E748F]">
          <Clock className="w-3 h-3" strokeWidth={1.5} />
          {formatDate(meeting.created_at)}
        </span>
        <SentimentBadge sentiment={meeting.sentiment} />
      </div>
    </Link>
  )
}
