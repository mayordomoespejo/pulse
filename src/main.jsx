import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import Toaster from './components/common/Toaster.jsx'
import { router } from './router/router.jsx'
import 'react-day-picker/style.css'
import './scss/index.scss'

import '../i18n-config.js'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider >
  </React.StrictMode >,
)
