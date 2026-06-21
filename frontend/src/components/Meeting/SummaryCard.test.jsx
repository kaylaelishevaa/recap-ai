import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SummaryCard from './SummaryCard'

describe('SummaryCard', () => {
  it('renders nothing when summary is null', () => {
    const { container } = render(<SummaryCard summary={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders summary text', () => {
    render(<SummaryCard summary="The team discussed the Q3 roadmap." />)
    expect(screen.getByText('The team discussed the Q3 roadmap.')).toBeInTheDocument()
  })

  it('shows English heading by default', () => {
    render(<SummaryCard summary="Test" />)
    expect(screen.getByText('Summary')).toBeInTheDocument()
  })

  it('shows Indonesian heading when language is id', () => {
    render(<SummaryCard summary="Test" language="id" />)
    expect(screen.getByText('Ringkasan')).toBeInTheDocument()
  })
})
