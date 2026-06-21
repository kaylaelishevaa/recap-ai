import { ArrowRight } from 'lucide-react'

export default function FollowUpsCard({ followUps, language = 'en' }) {
  if (!followUps?.length) return null

  return (
    <div className="bg-[#1F1828] border border-[#322843] rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <h3 className="flex items-center gap-2 mb-3 border-l-[3px] border-[#BEF264] pl-3">
        {language === 'id' ? 'Rekomendasi Tindak Lanjut' : 'Follow-up Recommendations'}
      </h3>
      <ul className="space-y-2.5">
        {followUps.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[#ECE7F1]">
            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#BEF264]" strokeWidth={1.5} />
            <span className="leading-[1.7]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
