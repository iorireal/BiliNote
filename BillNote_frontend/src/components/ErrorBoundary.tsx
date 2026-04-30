import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] 未捕获的渲染错误:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 p-8">
            <div className="rounded-full bg-red-100 p-4">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">页面出现错误</h2>
            <p className="text-sm text-neutral-500 max-w-md text-center">
              {this.state.error?.message || '发生了意外错误，请刷新页面后重试'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              刷新页面
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
