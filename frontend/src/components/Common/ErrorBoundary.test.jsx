import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

function ThrowingChild() {
  throw new Error('Test crash')
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <p>Hello world</p>
      </ErrorBoundary>
    )
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders fallback UI when child throws', () => {
    // Suppress console.error from React
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
    spy.mockRestore()
  })
})
