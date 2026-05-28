import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
})

function RedirectHandler() {
  const navigate = useNavigate()
  useEffect(() => {
    const redirect = sessionStorage.getItem('spa-redirect')
    if (redirect) {
      sessionStorage.removeItem('spa-redirect')
      navigate(redirect, { replace: true })
    }
  }, [navigate])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/ginadashboard">
        <RedirectHandler />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
