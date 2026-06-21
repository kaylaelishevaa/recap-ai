import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DecisionsCard from './DecisionsCard'

describe('DecisionsCard', () => {
  it('renders nothing when decisions is empty', () => {
    const { container } = render(<DecisionsCard decisions={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when decisions is null', () => {
    const { container } = render(<DecisionsCard decisions={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all decisions', () => {
    const decisions = ['Approved budget', 'Delayed launch to Q4']
    render(<DecisionsCard decisions={decisions} />)
    expect(screen.getByText('Approved budget')).toBeInTheDocument()
    expect(screen.getByText('Delayed launch to Q4')).toBeInTheDocument()
  })

  it('shows bilingual heading', () => {
    render(<DecisionsCard decisions={['Test']} language="id" />)
    expect(screen.getByText('Keputusan Utama')).toBeInTheDocument()
  })
})
