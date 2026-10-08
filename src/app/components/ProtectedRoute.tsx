import { Navigate, Outlet, useLocation } from 'react-router';
import { getAuthToken } from '../utils/api';

export default function ProtectedRoute() {
  const location = useLocation();

  if (!getAuthToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
