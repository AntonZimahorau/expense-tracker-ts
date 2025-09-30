import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/auth-context';

export default function RequireAuth() {
  const { ready, isAuthed } = useAuth();
  const location = useLocation();

  if (!ready) return null;

  if (!isAuthed) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
