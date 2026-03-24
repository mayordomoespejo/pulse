import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { isAuthenticated } from '../utils/auth'

import { ROUTES_NAMES } from './routesNames'

function RequireAuth() {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES_NAMES.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth
