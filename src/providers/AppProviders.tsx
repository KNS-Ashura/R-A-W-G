import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { queryClient } from '../lib/queryClient'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FavoritesProvider>
          {children}
          <Toaster richColors position="bottom-right" closeButton />
        </FavoritesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
