import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PasteTranscript from './PasteTranscript'
import { SAMPLE_TRANSCRIPTS } from '../../data/sampleTranscripts'

const ALL_SAMPLE_TEXTS = SAMPLE_TRANSCRIPTS.map((s) => s.text)

describe('PasteTranscript', () => {
  it('renders a "load random sample" button', () => {
    render(<PasteTranscript onSubmit={() => {}} isLoading={false} />)
    expect(screen.getByText(/load a random sample/i)).toBeInTheDocument()
  })

  it('loads one of the sample transcripts into the textarea on click', () => {
    render(<PasteTranscript onSubmit={() => {}} isLoading={false} />)
    fireEvent.click(screen.getByText(/load a random sample/i))
    const textarea = screen.getByPlaceholderText(/paste your meeting transcript/i)
    expect(ALL_SAMPLE_TEXTS).toContain(textarea.value)
  })

  it('disables Generate until there is text, then submits the loaded text', () => {
    const onSubmit = vi.fn()
    render(<PasteTranscript onSubmit={onSubmit} isLoading={false} />)
    const generate = screen.getByText('Generate Notes')
    expect(generate).toBeDisabled()

    fireEvent.click(screen.getByText(/load a random sample/i))
    const textarea = screen.getByPlaceholderText(/paste your meeting transcript/i)
    expect(generate).not.toBeDisabled()

    fireEvent.click(generate)
    expect(onSubmit).toHaveBeenCalledWith(textarea.value)
    expect(ALL_SAMPLE_TEXTS).toContain(textarea.value)
  })
})
