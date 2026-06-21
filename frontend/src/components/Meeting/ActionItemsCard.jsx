const priorityStyles = {
  high: 'bg-[#F4737A]/10 text-[#F4737A] border-[#F4737A]/20',
  medium: 'bg-[#BEF264]/10 text-[#BEF264] border-[#BEF264]/20',
  low: 'bg-[#5FD68A]/10 text-[#5FD68A] border-[#5FD68A]/20',
}

export default function ActionItemsCard({ actionItems, language = 'en' }) {
  if (!actionItems?.length) return null

  const isId = language === 'id'

  return (
    <div className="bg-[#1F1828] border border-[#322843] rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <h3 className="flex items-center gap-2 mb-4 border-l-[3px] border-[#BEF264] pl-3">
        {isId ? 'Item Aksi' : 'Action Items'}
      </h3>
      {/* Table — tablet and up */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.08em] text-[#7E748F] border-b border-[#322843]">
              <th className="pb-2.5 font-medium">Task</th>
              <th className="pb-2.5 font-medium">{isId ? 'Penanggung Jawab' : 'Assignee'}</th>
              <th className="pb-2.5 font-medium">Deadline</th>
              <th className="pb-2.5 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2236]">
            {actionItems.map((item, i) => (
              <tr key={i} className="text-[#ECE7F1]">
                <td className="py-3 pr-4 text-sm">{item.task}</td>
                <td className="py-3 pr-4 text-sm font-medium">{item.assignee}</td>
                <td className="py-3 pr-4 text-sm text-[#9A8FAE]">{item.deadline}</td>
                <td className="py-3 text-sm">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${priorityStyles[item.priority] || priorityStyles.medium}`}>
                    {item.priority || 'medium'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked cards — mobile */}
      <div className="space-y-3 sm:hidden">
        {actionItems.map((item, i) => (
          <div key={i} className="rounded-lg border border-[#322843] p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-[#ECE7F1] font-medium">{item.task}</p>
              <span className={`shrink-0 inline-block px-2 py-0.5 rounded text-xs font-medium border ${priorityStyles[item.priority] || priorityStyles.medium}`}>
                {item.priority || 'medium'}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#9A8FAE]">
              <span><span className="text-[#7E748F]">{isId ? 'Penanggung Jawab' : 'Assignee'}:</span> {item.assignee}</span>
              <span><span className="text-[#7E748F]">Deadline:</span> {item.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
