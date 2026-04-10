import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '16px' }}>
            Something went wrong
          </h1>
          <div style={{ 
            backgroundColor: '#fee2e2', 
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Error:</h2>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {this.state.error?.toString()}
            </pre>
          </div>
          {this.state.errorInfo && (
            <div style={{ 
              backgroundColor: '#f3f4f6',
              border: '1px solid #9ca3af',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Stack Trace:</h2>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;