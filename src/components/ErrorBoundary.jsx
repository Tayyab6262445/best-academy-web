import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-10 text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Something went wrong
          </h1>
          <p className="mt-2 font-medium text-slate-400">
            Please refresh the page. If the problem persists, contact the academy office.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-2xl bg-academyRed px-8 py-4 text-xs font-black uppercase tracking-widest text-white"
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
