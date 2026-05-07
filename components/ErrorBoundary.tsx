'use client'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="min-h-screen flex items-center justify-center bg-bg-primary"
          >
            <div className="text-center p-8">
              <p className="text-text-secondary text-lg">
                Bir xəta baş verdi. Zəhmət olmasa səhifəni yeniləyin.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 px-6 py-2 rounded-xl bg-accent-primary text-white text-sm hover:opacity-90 transition-opacity"
              >
                Yenidən cəhd et
              </button>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
