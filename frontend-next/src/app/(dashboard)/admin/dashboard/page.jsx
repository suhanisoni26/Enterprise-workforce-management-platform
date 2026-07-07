"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import employeeService from '@/services/employees.service';
import api from '@/services/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsData = await employeeService.getStats();
        if (statsData?.success) {
          setStats(statsData.data);
        }

        const logsRes = await api.get("/employees/audit-logs");
        if (logsRes.data?.success) {
          setLogs(logsRes.data.data.logs || []);
        }

        const leavesRes = await api.get("/leave/stats").catch(() => null);
        if (leavesRes?.data?.success) {
          setPendingLeavesCount(leavesRes.data.data.pending || 0);
        }
      } catch (err) {
        console.error("Dashboard load error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getLogColor = (action) => {
    if (action.includes('FAIL') || action.includes('LOCK')) return 'text-red-400';
    if (action.includes('CREATE') || action.includes('ACTIVATE')) return 'text-emerald-400';
    if (action.includes('UPDATE')) return 'text-yellow-400';
    return 'text-indigo-400';
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Admin Workspace
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Welcome back, {user?.email?.split('@')[0] || 'Admin'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Here's what's happening across your workforce today.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/departments')}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors shadow-sm"
          >
            Departments
          </button>
          <button 
            onClick={() => router.push('/admin/employees/new')}
            className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm"
          >
            + New Employee
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Employees", value: stats ? stats.total : "...", change: `${stats ? stats.active : "..."} Active in DB` },
          { label: "Inactive Accounts", value: stats ? stats.inactive : "...", change: "Soft-deleted / suspended" },
          { label: "Pending Leaves", value: pendingLeavesCount, change: "Needs HR review" },
          { label: "System Alerts", value: "0", change: "All systems operational" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{kpi.label}</h3>
            <p className="text-3xl font-semibold text-gray-900 mt-2 tracking-tight">{kpi.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-6">Recent Activity Feed</h2>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">No activity registered yet.</p>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {logs.slice(0, 10).map((log, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${
                    log.status === 'success' 
                      ? (log.action.includes('CREATE') ? 'bg-emerald-500' : 'bg-indigo-500') 
                      : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{log.details || `${log.action} performed by ${log.userEmail}`}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(log.createdAt).toLocaleString()} • IP: {log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0a0a0b] rounded-xl border border-gray-800 p-8 shadow-sm relative overflow-hidden flex flex-col h-[400px]">
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '2rem 2rem'
            }}
          />
          <h2 className="text-lg font-semibold text-white tracking-tight mb-4 relative z-10">Operations Console Log</h2>
          <div className="text-[11px] font-mono text-gray-400 space-y-2 relative z-10 overflow-y-auto flex-1 scrollbar-thin">
            <p className="text-gray-500">// System console feed initialized...</p>
            {logs.slice(0, 20).map((log, idx) => (
              <p key={idx} className={getLogColor(log.action)}>
                [{formatTime(log.createdAt)}] [{log.status.toUpperCase()}] {log.action} - {log.userEmail.split('@')[0]}
              </p>
            ))}
            <p className="text-gray-500 animate-pulse mt-4">_ Waiting for events...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
