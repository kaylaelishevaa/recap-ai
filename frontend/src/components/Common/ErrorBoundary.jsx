import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#15101C] px-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-[#BEF264] mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="text-2xl mb-2">Something went wrong</h1>
            <p className="text-[#9A8FAE] text-sm mb-6">
              An unexpected error occurred. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-2.5 px-6 rounded-lg text-sm font-medium text-[#15101C] uppercase tracking-[0.05em] bg-[#BEF264] hover:bg-[#A3E635] transition-all duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
