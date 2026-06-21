export default function SummaryCard({ summary, language = 'en' }) {
  if (!summary) return null

  return (
    <div className="bg-[#1F1828] border border-[#322843] rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <h3 className="flex items-center gap-2 mb-3 border-l-[3px] border-[#BEF264] pl-3">
        {language === 'id' ? 'Ringkasan' : 'Summary'}
      </h3>
      <p className="text-[#ECE7F1] leading-[1.7]">
        {summary}
      </p>
    </div>
  )
}
