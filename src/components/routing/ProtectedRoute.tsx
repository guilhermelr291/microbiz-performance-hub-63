import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';

interface ProtectedRouteProps {
  requireLicense?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireLicense = true,
  requireAdmin = false,
}) => {
  const { loading } = useAuth();
  const { selectedCompanyId: selectedLicenseId } = useCompany();
  const location = useLocation();

  const user = localStorage.getItem('authUser')
    ? JSON.parse(localStorage.getItem('authUser')!)
    : null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
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
