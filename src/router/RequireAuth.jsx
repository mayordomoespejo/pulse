import { Navigate, Outlet, useLocation } from 'react-router-dom';

import Spinner from '../components/ui/Spinner';
import { useAuthStore } from '../stores/authStore';

import { ROUTES_NAMES } from './routesNames';

function RequireAuth() {
  const location = useLocation();
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Spinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES_NAMES.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth;
