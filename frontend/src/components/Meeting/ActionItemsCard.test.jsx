import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ActionItemsCard from './ActionItemsCard'

describe('ActionItemsCard', () => {
  it('renders nothing when empty', () => {
    const { container } = render(<ActionItemsCard actionItems={[]} />)
    expect(container.firstChild).toBeNull()
  })

  const items = [
    { task: 'Update roadmap', assignee: 'Sarah', deadline: 'Friday', priority: 'high' },
    { task: 'Review PR', assignee: 'TBD', deadline: 'TBD', priority: 'low' },
  ]

  it('renders task, assignee, deadline, priority', () => {
    // Rendered in both the table (tablet+) and stacked cards (mobile); both are
    // in the DOM and toggled via responsive CSS, so each value appears twice.
    render(<ActionItemsCard actionItems={items} />)
    expect(screen.getAllByText('Update roadmap').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sarah').length).toBeGreaterThan(0)
    expect(screen.getAllByText('high').length).toBeGreaterThan(0)
    expect(screen.getAllByText('low').length).toBeGreaterThan(0)
  })

  it('shows bilingual heading', () => {
    render(<ActionItemsCard actionItems={items} language="id" />)
    expect(screen.getByText('Item Aksi')).toBeInTheDocument()
    expect(screen.getByText('Penanggung Jawab')).toBeInTheDocument()
  })
})
