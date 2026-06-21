import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Mic, ClipboardPaste } from 'lucide-react'
import UploadZone from '../components/Upload/UploadZone'
import RecordAudio from '../components/Upload/RecordAudio'
import PasteTranscript from '../components/Upload/PasteTranscript'
import LoadingState from '../components/Common/LoadingState'
import { uploadFile, submitTranscript } from '../services/api'

const tabs = [
  { id: 'upload', label: 'Upload File', short: 'Upload', icon: Upload },
  { id: 'record', label: 'Record Audio', short: 'Record', icon: Mic },
  { id: 'paste', label: 'Paste Transcript', short: 'Paste', icon: ClipboardPaste },
]

const languages = [
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'English', hint: 'Best for fully English meetings' },
  { code: 'id', flag: '\u{1F1EE}\u{1F1E9}', label: 'Bahasa Indonesia', hint: 'Terbaik untuk rapat full Bahasa Indonesia' },
  { code: 'mixed', flag: '\u{1F1EC}\u{1F1E7}\u{1F1EE}\u{1F1E9}', label: 'Mixed (EN + ID)', hint: 'For meetings that switch between English and Indonesian' },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('upload')
  const [language, setLanguage] = useState(() => localStorage.getItem('mm-lang') || 'mixed')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('mm-lang', language)
  }, [language])

  async function handleFileSubmit(file) {
    setIsLoading(true)
    setError(null)
    setLoadingStep(1)
    try {
      const stepTimer = setTimeout(() => setLoadingStep(2), 3000)
      const stepTimer2 = setTimeout(() => setLoadingStep(3), 6000)
      const result = await uploadFile(file, language)
      clearTimeout(stepTimer)
      clearTimeout(stepTimer2)
      navigate(`/meeting/${result.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
      setIsLoading(false)
    }
  }

  async function handleTranscriptSubmit(text) {
    setIsLoading(true)
    setError(null)
    setLoadingStep(2)
    try {
      const stepTimer = setTimeout(() => setLoadingStep(3), 3000)
      const result = await submitTranscript(text, null, language)
      clearTimeout(stepTimer)
      navigate(`/meeting/${result.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Processing failed. Please try again.')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingState step={loadingStep} hasFile={activeTab !== 'paste'} />
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-10">
        <h1>Transform meetings into action</h1>
        <p className="text-[#9A8FAE] mt-2">
          Upload a recording, use your mic, or paste a transcript to generate structured notes.
        </p>
      </div>

      {/* Language toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-[#322843] max-w-full">
          {languages.map(({ code, flag, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              title={label}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                language === code
                  ? 'bg-[#BEF264] text-[#15101C]'
                  : 'text-[#9A8FAE] hover:text-[#ECE7F1]'
              }`}
            >
              <span>{flag}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-[11px] text-[#7E748F] -mt-4 mb-6">
        {languages.find((l) => l.code === language)?.hint}
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-5 sm:gap-8 mb-8 border-b border-[#322843]">
        {tabs.map(({ id, label, short, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setError(null) }}
            className={`flex items-center gap-2 pb-3 text-[13px] sm:text-sm font-medium tracking-[0.02em] transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
              activeTab === id
                ? 'text-[#ECE7F1] border-[#BEF264]'
                : 'text-[#9A8FAE] border-transparent hover:text-[#ECE7F1]'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-[#F4737A]/8 border border-[#F4737A]/20 text-[#F4737A] text-sm">
          {error}
        </div>
      )}

      <div>
        {activeTab === 'upload' && <UploadZone onSubmit={handleFileSubmit} isLoading={isLoading} />}
        {activeTab === 'record' && <RecordAudio onSubmit={handleFileSubmit} isLoading={isLoading} />}
        {activeTab === 'paste' && <PasteTranscript onSubmit={handleTranscriptSubmit} isLoading={isLoading} />}
      </div>
    </div>
  )
}
