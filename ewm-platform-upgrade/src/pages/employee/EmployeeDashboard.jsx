import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineUser, HiOutlineBriefcase, HiOutlineCalendar, HiOutlineClock, HiOutlineArrowRight, HiOutlineClipboardList, HiOutlineCurrencyDollar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FormField, TextInput } from '../../components/ui/FormField';
import StatCard from '../../components/ui/StatCard';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword, confirmPassword);
      toast.success('Password changed successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password" description="You must change your password before continuing.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Current Password">
          <TextInput type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </FormField>
        <FormField label="New Password" hint="Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char">
          <TextInput type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
        </FormField>
        <FormField label="Confirm Password">
          <TextInput type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </FormField>
        <Button type="submit" variant="primary" loading={isLoading} className="w-full mt-2">
          {isLoading ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
    </Modal>
  );
};

const EmployeeDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setProfile(response.data);
        if (response.data.user.mustChangePassword) {
          setShowChangePassword(true);
        }
      } catch {
        // Handled by interceptor
      }
    };
    fetchProfile();
  }, []);

  const infoItems = profile?.employee
    ? [
        { label: 'Employee ID', value: profile.employee.employeeId, icon: HiOutlineUser, color: '#3B82F6' },
        { label: 'Designation', value: profile.employee.designation || 'Not assigned', icon: HiOutlineBriefcase, color: '#8B5CF6' },
        { label: 'Joining Date', value: profile.employee.joiningDate ? new Date(profile.employee.joiningDate).toLocaleDateString() : '—', icon: HiOutlineCalendar, color: '#F59E0B' },
        { label: 'Employment Type', value: (profile.employee.employmentType || '').replace('_', ' '), icon: HiOutlineClock, color: '#22D3EE' },
      ]
    : [];

  const shortcuts = [
    { label: 'Attendance', desc: 'View your check-ins', icon: HiOutlineCalendar, path: '/employee/attendance' },
    { label: 'Leave Requests', desc: 'Apply or track status', icon: HiOutlineClipboardList, path: '/employee/leave' },
    { label: 'Payroll', desc: 'Download payslips', icon: HiOutlineCurrencyDollar, path: '/employee/payroll' },
  ];

  return (
    <div className="space-y-8">
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => {
          setShowChangePassword(false);
          if (user) updateUser({ ...user, mustChangePassword: false });
        }}
      />

      {/* Welcome */}
      <Card hover>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            {profile?.employee ? `${profile.employee.firstName[0]}${profile.employee.lastName[0]}` : '?'}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
              {profile?.employee?.firstName || user?.email?.split('@')[0] || 'Employee'} 👋
            </h1>
            <p className="text-xs text-[#64748B] mt-1">Here's a snapshot of your personal workspace.</p>
          </div>
        </div>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {infoItems.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <StatCard key={i} loading />)
          : infoItems.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} accent={item.color} />
            ))}
      </div>

      {/* Shortcuts */}
      <div>
        <h2 className="text-sm font-bold text-[#F8FAFC] mb-4 uppercase tracking-wider">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {shortcuts.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.path)}
              className="text-left p-6 rounded-2xl border transition-all duration-300 hover:border-[rgba(59,130,246,0.35)] hover:-translate-y-0.5 group"
              style={{ backgroundColor: 'var(--surface, #1E293B)', borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}
            >
              <s.icon className="w-6 h-6 text-[#3B82F6] mb-4" />
              <p className="text-sm font-bold text-[#F8FAFC]">{s.label}</p>
              <p className="text-[11px] text-[#64748B] mt-1">{s.desc}</p>
              <HiOutlineArrowRight className="w-4 h-4 text-[#3B82F6] mt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
