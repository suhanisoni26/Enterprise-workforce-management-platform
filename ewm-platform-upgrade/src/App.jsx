import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages (unchanged)
import LoginPage from './pages/auth/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEmployeePage from './pages/admin/CreateEmployeePage';
import EmployeesPage from './pages/admin/EmployeesPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import RecruitmentPage from './pages/admin/RecruitmentPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AttendancePage from './pages/employee/AttendancePage';
import LeavePage from './pages/employee/LeavePage';
import PayrollPage from './pages/employee/PayrollPage';

// Shared
import AIAssistantPage from './pages/ai/AIAssistantPage';

// Placeholder for 404
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0F172A' }}>
    <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">404</h1>
    <p className="mt-4 text-xl text-[#94A3B8]">Page not found</p>
    <button
      onClick={() => window.history.back()}
      className="mt-8 px-6 py-2.5 rounded-lg text-white text-xs font-bold uppercase tracking-wider"
      style={{ background: '#3B82F6' }}
    >
      Go Back
    </button>
  </div>
);

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null; // Handled by ProtectedRoute or AuthContext initial mount

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'].includes(user?.role) ? '/admin/dashboard' : '/employee/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER']} />}>
        <Route element={<MainLayout isAdmin={true} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-employee" element={<CreateEmployeePage />} />
          <Route path="/admin/employees" element={<EmployeesPage />} />
          <Route path="/admin/departments" element={<DepartmentsPage />} />
          <Route path="/admin/recruitment" element={<RecruitmentPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout isAdmin={false} />}>
          <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/attendance" element={<AttendancePage />} />
          <Route path="/employee/leave" element={<LeavePage />} />
          <Route path="/employee/payroll" element={<PayrollPage />} />
          <Route path="/employee/ai-assistant" element={<AIAssistantPage />} />
        </Route>
      </Route>

      {/* Root Redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'].includes(user?.role)
                  ? '/admin/dashboard'
                  : '/employee/dashboard'
                : '/login'
            }
            replace
          />
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
