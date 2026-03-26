import { Component } from "react"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error("App crashed", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-sand px-6 text-center">
          <div>
            <p className="text-5xl">⚠️</p>
            <h1 className="mt-4 text-2xl font-semibold text-primary">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500">Please refresh the app and try again.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
