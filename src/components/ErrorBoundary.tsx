import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IErrorBoundaryProps {
    children: ReactNode
    fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface IErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

const DefaultErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ error, reset }) => (
    <div className="error-boundary">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-content"
        >
            <h2>Oops! Something went wrong</h2>
            <details className="error-details">
                <summary>Error details</summary>
                <pre>{error.message}</pre>
            </details>
            <button onClick={reset} className="retry-button">
                Try again
            </button>
        </motion.div>
        
        <style>{`
            .error-boundary {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 20px;
                background: #f8f9fa;
            }
            
            .error-content {
                background: white;
                border-radius: 8px;
                padding: 32px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }
            
            .error-content h2 {
                color: #dc3545;
                margin-bottom: 16px;
            }
            
            .error-details {
                margin: 16px 0;
                text-align: left;
            }
            
            .error-details pre {
                background: #f8f9fa;
                padding: 12px;
                border-radius: 4px;
                overflow-x: auto;
                font-size: 14px;
            }
            
            .retry-button {
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.2s;
            }
            
            .retry-button:hover {
                background: #0056b3;
            }
        `}</style>
    </div>
)

export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): IErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        
        // Log to error reporting service
        // reportError(error, errorInfo)
    }

    reset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback
            return <FallbackComponent error={this.state.error} reset={this.reset} />
        }

        return this.props.children
    }
} 