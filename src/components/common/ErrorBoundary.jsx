import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '200px',
            gap: '16px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '1rem', color: '#ccc' }}>
            Algo salió mal. Por favor, intenta recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: '1px solid #555',
              borderRadius: '6px',
              background: 'transparent',
              color: '#fff',
            }}
          >
            Recargar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
