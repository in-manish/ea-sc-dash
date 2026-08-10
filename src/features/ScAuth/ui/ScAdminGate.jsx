import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { canAccessScPortal } from '../domain/scLoginUser';

/** SC routes: require ADMIN, STAFF, or SNAPCARD_USER. Others are signed out. */
export default function ScAdminGate({ children }) {
  const { user, isAuthenticated, isLoading, logout, currentMode } = useAuth();
  const deny = currentMode === 'SC' && isAuthenticated && !canAccessScPortal(user);

  useEffect(() => {
    if (deny) logout();
  }, [deny, logout]);

  if (isLoading) return null;
  if (deny) return <Navigate to="/login" replace />;
  return children;
}
