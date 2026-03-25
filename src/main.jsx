import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import Toaster from './components/common/Toaster.jsx'
import { router } from './router/router.jsx'
import './scss/index.scss'
import { useAuthStore } from './stores/authStore.js'

import '../i18n-config.js'

// Initialize Firebase auth listener before rendering
useAuthStore.getState().init()

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Toaster />
    </QueryClientProvider >
  </React.StrictMode >,
)
