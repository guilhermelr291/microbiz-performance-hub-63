import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLicense } from '@/contexts/LicenseContext';

interface ProtectedRouteProps {
  requireLicense?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireLicense = true,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const { selectedLicenseId } = useLicense();
  const location = useLocation();

  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  console.log('loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !user?.roles?.includes('admin')) {
    return <Navigate to="/" replace />;
  }

  if (requireLicense && !selectedLicenseId) {
    return <Navigate to="/select-license" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
