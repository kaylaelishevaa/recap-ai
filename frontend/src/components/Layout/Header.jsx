import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BrainCircuit, Upload, History, Info, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'New Meeting', icon: Upload },
  { to: '/history', label: 'History', icon: History },
]

export default function Header() {
  const location = useLocation()
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <header className="border-b border-[#322843] bg-[#15101C] sticky top-0 z-50">
        <div className="max-w-[960px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <BrainCircuit className="w-6 h-6 text-[#BEF264] group-hover:text-[#A3E635] transition-colors" strokeWidth={1.5} />
            <span className="font-['Sora'] text-xl font-semibold text-[#ECE7F1]">
              Recap<span className="text-[#BEF264]">AI</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-8">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  title={label}
                  className={`flex items-center gap-2 text-sm font-medium uppercase tracking-[0.05em] transition-colors ${
                    isActive
                      ? 'text-[#ECE7F1]'
                      : 'text-[#9A8FAE] hover:text-[#ECE7F1]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
            <button
              onClick={() => setShowAbout(true)}
              className="text-[#9A8FAE] hover:text-[#ECE7F1] transition-colors"
              aria-label="About RecapAI"
            >
              <Info className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </nav>
        </div>
      </header>

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowAbout(false)}>
          <div role="dialog" aria-label="About RecapAI" className="bg-[#1F1828] border border-[#322843] rounded-xl p-8 max-w-md mx-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#BEF264]" strokeWidth={1.5} />
                <h2 className="font-['Sora'] text-lg font-semibold text-[#ECE7F1]">About RecapAI</h2>
              </div>
              <button onClick={() => setShowAbout(false)} className="text-[#7E748F] hover:text-[#ECE7F1] transition-colors">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-sm text-[#9A8FAE] leading-relaxed">
              RecapAI uses advanced speech recognition and large language models to transform
              meeting recordings into structured, actionable notes. Built with React, FastAPI, OpenAI
              Whisper, and GPT-4o, plus a keyless mock mode for offline demos.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['React', 'Vite', 'Tailwind CSS', 'FastAPI', 'PostgreSQL', 'Whisper', 'GPT-4o'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md border border-[#322843] text-[#7E748F] text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
