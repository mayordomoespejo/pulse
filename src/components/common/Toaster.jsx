import { Toaster as HotToaster } from 'react-hot-toast'

const TOAST_OPTIONS = {
  duration: 4000,
  style: {
    background: '#363636',
    color: '#fff',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#4bb543',
      secondary: '#fff',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ee2737',
      secondary: '#fff',
    },
  },
}

/**
 * App-wide toast notification provider (top-right, dark theme).
 * Mount once at the app root.
 *
 * @returns {JSX.Element}
 */
const Toaster = () => {
  return (
    <HotToaster position="top-right" toastOptions={TOAST_OPTIONS} />
  )
}

export default Toaster
