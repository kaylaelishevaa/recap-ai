export default function DecisionsCard({ decisions, language = 'en' }) {
  if (!decisions?.length) return null

  return (
    <div className="bg-[#1F1828] border border-[#322843] rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <h3 className="flex items-center gap-2 mb-3 border-l-[3px] border-[#BEF264] pl-3">
        {language === 'id' ? 'Keputusan Utama' : 'Key Decisions'}
      </h3>
      <ol className="space-y-2.5">
        {decisions.map((decision, i) => (
          <li key={i} className="flex gap-3 text-[#ECE7F1]">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2A2236] text-[#9A8FAE] text-xs font-medium flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="leading-[1.7]">{decision}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
