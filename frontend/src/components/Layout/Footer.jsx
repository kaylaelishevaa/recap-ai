export default function Footer() {
  return (
    <footer className="border-t border-[#322843] mt-auto">
      <div className="max-w-[960px] mx-auto px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7E748F]">
        <p>
          Powered by AI &middot; Built by{' '}
          <a
            href="https://github.com/kaylaelisheva"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9A8FAE] hover:text-[#ECE7F1] transition-colors"
          >
            Kayla Elisheva Siwi
          </a>
        </p>
        <div className="flex items-center gap-2">
          {['React', 'FastAPI', 'Whisper', 'GPT-4o'].map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded border border-[#322843] text-[#7E748F] text-[11px]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
