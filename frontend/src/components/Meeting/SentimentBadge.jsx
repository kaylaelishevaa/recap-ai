export default function SentimentBadge({ sentiment }) {
  if (!sentiment) return null

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#2A2236] border border-[#322843] text-[#9A8FAE] text-xs">
      {sentiment}
    </span>
  )
}
