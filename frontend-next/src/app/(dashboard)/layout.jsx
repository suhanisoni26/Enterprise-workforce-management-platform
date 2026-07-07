"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import authService from "@/services/auth.service";
import { 
  HiOutlineBell, 
  HiOutlineSearch, 
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar
} from "react-icons/hi";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, isLoading, user, logout, updateUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for clickaway
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword, confirmPassword);
      toast.success('Password updated successfully!');
      updateUser({ ...user, mustChangePassword: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // If user must change password, block the UI
  if (user?.mustChangePassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
                Security Requirement
              </span>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Update your password</h2>
              <p className="text-sm text-gray-500 mt-2">
                This is your first time logging in (or your password was reset). Please choose a new, secure password to continue to your workspace.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={logout}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm disabled:opacity-70"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'].includes(user?.role);
  const isManager = ['MANAGER', 'TEAM_LEAD'].includes(user?.role);

  let navItems = [];
  if (isAdmin) {
    navItems = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineHome },
      { name: 'Employees', path: '/admin/employees', icon: HiOutlineUsers },
      { name: 'Departments', path: '/admin/departments', icon: HiOutlineOfficeBuilding },
      { name: 'Leave', path: '/admin/leave', icon: HiOutlineClipboardList },
      { name: 'Analytics', path: '/admin/analytics', icon: HiOutlineChartBar },
      { name: 'Settings', path: '/admin/settings', icon: HiOutlineCog },
    ];
  } else if (isManager) {
    navItems = [
      { name: 'Dashboard', path: '/manager/dashboard', icon: HiOutlineHome },
      { name: 'Team', path: '/manager/team', icon: HiOutlineUsers },
      { name: 'Approvals', path: '/manager/approvals', icon: HiOutlineClipboardList },
    ];
  } else {
    navItems = [
      { name: 'Dashboard', path: '/employee/dashboard', icon: HiOutlineHome },
      { name: 'Attendance', path: '/employee/attendance', icon: HiOutlineCalendar },
      { name: 'Leave', path: '/employee/leave', icon: HiOutlineClipboardList },
      { name: 'Payroll', path: '/employee/payroll', icon: HiOutlineCurrencyDollar },
    ];
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200">
        <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center shadow-sm">
                <span className="font-bold text-sm leading-none">N</span>
              </div>
              <span className="font-bold text-sm tracking-tight text-black">Nexora</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin/dashboard' && item.path !== '/employee/dashboard' && item.path !== '/manager/dashboard');
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'text-black bg-gray-100'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Search */}
            <div className="relative flex items-center" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-400 hover:text-black transition-colors flex items-center justify-center p-1 rounded-md"
              >
                <HiOutlineSearch className="w-5 h-5" />
              </button>
              
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-2 transform origin-top-right transition-all">
                  <div className="relative">
                    <HiOutlineSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search employees, departments..." 
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative flex items-center" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`transition-colors relative flex items-center justify-center p-1 rounded-md ${isNotificationsOpen ? 'text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform origin-top-right transition-all">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { title: "New leave request", desc: "Sarah Jenkins requested 2 days off", time: "5m ago", unread: true },
                      { title: "System Update", desc: "Scheduled maintenance tonight at 2 AM", time: "1h ago", unread: false },
                      { title: "Password Changed", desc: "Your account password was updated successfully", time: "2h ago", unread: false },
                    ].map((notif, idx) => (
                      <div key={idx} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-indigo-50/30' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-medium ${notif.unread ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</span>
                          <span className="text-[10px] text-gray-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-gray-500">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center border-t border-gray-100 bg-gray-50/50 hover:bg-gray-100 cursor-pointer">
                    <span className="text-xs font-medium text-gray-600">View all notifications</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-4 w-px bg-gray-200"></div>

            {/* User Profile */}
            <div className="relative flex items-center" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 group outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700 group-hover:bg-gray-200 transition-colors">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform origin-top-right transition-all">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user?.email}
                    </p>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      {user?.role}
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/employee/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      My Profile
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Account Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
