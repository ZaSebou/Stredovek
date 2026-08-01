import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../core/logger';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React ErrorBoundary', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-300 p-6 text-center font-sans">
          <h1 className="text-2xl text-red-500 mb-4 tracking-widest uppercase">
            Kritická chyba systému
          </h1>
          <p className="max-w-md text-neutral-400 mb-6 leading-relaxed">
            Něco se ošklivě pokazilo při vykreslování hry. Zkontrolujte prosím konzoli (F12) pro více informací.
          </p>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded text-left text-sm font-mono text-red-400 w-full max-w-lg overflow-auto mb-6">
             {this.state.errorMsg || "Neznámá chyba"}
          </div>
          <button
            className="px-6 py-2 border border-neutral-700 hover:border-neutral-500 hover:text-white transition-colors duration-200 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Znovu načíst hru
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
