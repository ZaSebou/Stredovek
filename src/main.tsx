import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { logger } from './core/logger'

// Globální chytání chyb, které utečou Reactu
window.addEventListener('error', (event) => {
  logger.error('Global Window Error', { message: event.message, filename: event.filename, lineno: event.lineno, colno: event.colno, error: event.error });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
