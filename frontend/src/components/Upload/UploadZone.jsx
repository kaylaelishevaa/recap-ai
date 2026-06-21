import { useState, useRef } from 'react'
import { UploadCloud, FileAudio, X } from 'lucide-react'

const ACCEPTED = '.mp3,.mp4,.wav,.webm,.m4a,.ogg'
const MAX_SIZE = 200 * 1024 * 1024

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadZone({ onSubmit, isLoading }) {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  function validate(f) {
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ACCEPTED.split(',').includes(ext)) {
      setError(`Unsupported file type. Allowed: ${ACCEPTED}`)
      return false
    }
    if (f.size > MAX_SIZE) {
      setError('File exceeds 200MB limit')
      return false
    }
    setError(null)
    return true
  }

  function handleFile(f) {
    if (validate(f)) setFile(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl py-16 px-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-[#BEF264] bg-[#BEF264]/5'
            : 'border-[#4A4060] hover:border-[#BEF264] bg-[#15101C]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
        <UploadCloud className="w-12 h-12 mx-auto mb-4 text-[#BEF264]" strokeWidth={1.5} />
        <p className="font-['Sora'] text-xl text-[#ECE7F1] font-semibold">Drop your file here</p>
        <p className="text-[13px] text-[#7E748F] mt-2">
          Supports MP3, MP4, WAV, WebM, M4A, OGG — max 20 minutes
        </p>
      </div>

      {error && (
        <p className="text-[#F4737A] text-sm">{error}</p>
      )}

      {file && (
        <div className="flex items-center justify-between bg-[#1F1828] border border-[#322843] rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <FileAudio className="w-5 h-5 text-[#BEF264]" strokeWidth={1.5} />
            <div>
              <p className="text-sm text-[#ECE7F1] font-medium">{file.name}</p>
              <p className="text-xs text-[#7E748F]">{formatSize(file.size)}</p>
            </div>
          </div>
          <button onClick={() => setFile(null)} className="text-[#7E748F] hover:text-[#ECE7F1] transition-colors">
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => onSubmit(file)}
          disabled={!file || isLoading}
          className="py-3 px-8 rounded-lg font-medium text-sm text-[#15101C] uppercase tracking-[0.05em] bg-[#BEF264] hover:bg-[#A3E635] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          Generate Notes
        </button>
      </div>
    </div>
  )
}
