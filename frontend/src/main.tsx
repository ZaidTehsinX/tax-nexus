import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: '#800020',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fff',
          },
        },
      }}
    />
    <App />
  </StrictMode>,
)
