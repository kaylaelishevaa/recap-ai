import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Loader2, Upload, Inbox } from 'lucide-react'
import MeetingList from '../components/History/MeetingList'
import ErrorState from '../components/Common/ErrorState'
import { listMeetings } from '../services/api'

const langFilters = [
  { value: null, label: 'All' },
  { value: 'en', label: '\u{1F1EC}\u{1F1E7} English' },
  { value: 'id', label: '\u{1F1EE}\u{1F1E9} Bahasa' },
  { value: 'mixed', label: '\u{1F1EC}\u{1F1E7}\u{1F1EE}\u{1F1E9} Mixed' },
]

export default function HistoryPage() {
  const [meetings, setMeetings] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const limit = 12

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listMeetings(page, limit, search || null, langFilter)
      setMeetings(data.meetings)
      setTotal(data.total)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }, [page, search, langFilter])

  useEffect(() => {
    fetch()
  }, [fetch])

  useEffect(() => {
    setPage(1)
  }, [search, langFilter])

  const totalPages = Math.ceil(total / limit)

  if (error) {
    return <ErrorState message={error} onRetry={fetch} />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2>Meeting History</h2>
        <div className="flex items-center gap-3">
          {/* Language filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-[#322843]">
            {langFilters.map(({ value, label }) => (
              <button
                key={label}
                onClick={() => setLangFilter(value)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  langFilter === value
                    ? 'bg-[#BEF264] text-[#15101C]'
                    : 'text-[#9A8FAE] hover:text-[#ECE7F1]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E748F]" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings..."
              className="w-full bg-[#1F1828] border border-[#322843] rounded-lg pl-9 pr-3 py-2 text-sm text-[#ECE7F1] placeholder-[#7E748F] focus:outline-none focus:border-[#BEF264] transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 text-[#BEF264] animate-spin" strokeWidth={1.5} />
        </div>
      ) : meetings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <Inbox className="w-12 h-12 text-[#BEF264]" strokeWidth={1.5} />
          {search || langFilter ? (
            <p className="text-[#9A8FAE]">No meetings match your filters</p>
          ) : (
            <>
              <h3 className="font-['Sora'] text-xl">Your notes will appear here</h3>
              <p className="text-sm text-[#9A8FAE]">Upload your first recording to get started</p>
              <Link
                to="/"
                className="flex items-center gap-2 mt-2 py-3 px-6 rounded-lg text-sm font-medium text-[#15101C] uppercase tracking-[0.05em] bg-[#BEF264] hover:bg-[#A3E635] transition-all duration-200"
              >
                <Upload className="w-4 h-4" strokeWidth={1.5} /> New Meeting
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <MeetingList meetings={meetings} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm border border-[#4A4060] hover:border-[#BEF264] text-[#ECE7F1] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              <span className="text-[13px] text-[#7E748F]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm border border-[#4A4060] hover:border-[#BEF264] text-[#ECE7F1] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
