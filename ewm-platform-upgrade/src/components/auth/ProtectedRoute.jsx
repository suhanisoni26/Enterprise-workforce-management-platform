/**
 * Protected Route Component
 * Handles authentication and role-based access control for routes.
 * NOTE: Auth/redirect logic is unchanged — only the loading UI is restyled.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-[#3B82F6]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest animate-pulse">Loading Platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Save attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force password change check
  if (user.mustChangePassword && location.pathname !== '/change-password') {
    // Only intercept if we aren't already on the change password modal/page
    // For now, our EmployeeDashboard handles the modal, but if we had a dedicated page:
    // return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error("You don't have permission to access this page.");
    // Redirect based on role
    if (['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'].includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
