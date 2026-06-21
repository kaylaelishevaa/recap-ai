import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SentimentBadge from './SentimentBadge'

describe('SentimentBadge', () => {
  it('renders nothing when sentiment is null', () => {
    const { container } = render(<SentimentBadge sentiment={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when sentiment is empty string', () => {
    const { container } = render(<SentimentBadge sentiment="" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders sentiment text', () => {
    render(<SentimentBadge sentiment="Productive and focused" />)
    expect(screen.getByText('Productive and focused')).toBeInTheDocument()
  })
})
