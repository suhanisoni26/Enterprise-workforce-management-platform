"use client";

import { useAuth } from "@/hooks/useAuth";

export default function EmployeeDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Employee Workspace
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Welcome back, {user?.email?.split('@')[0] || 'Employee'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Here's a quick snapshot of your attendance and upcoming schedules.
          </p>
        </div>
        
        {/* Quick Check-in Button */}
        <button className="shrink-0 px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Check In Now
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Today's Status", value: "Checked In", change: "At 09:02 AM", highlight: true },
          { label: "Leave Balance", value: "14 Days", change: "Annual Leave" },
          { label: "Hours This Week", value: "32.5h", change: "7.5h remaining" },
          { label: "Next Holiday", value: "Oct 24", change: "Diwali" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{kpi.label}</h3>
            <p className={`text-2xl font-semibold mt-2 tracking-tight ${kpi.highlight ? 'text-emerald-600' : 'text-gray-900'}`}>{kpi.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Recent Attendance</h2>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</a>
          </div>
          <div className="space-y-4">
            {[
              { date: 'Today, Oct 12', in: '09:02 AM', out: '--:--' },
              { date: 'Yesterday, Oct 11', in: '08:55 AM', out: '05:30 PM' },
              { date: 'Wed, Oct 10', in: '09:10 AM', out: '06:05 PM' },
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <p className="text-sm font-medium text-gray-900">{log.date}</p>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{log.in} - {log.out}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">My Requests</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">+ New Request</button>
          </div>
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">No pending requests</p>
            <p className="text-xs text-gray-500 mt-1">You don't have any active leave or expense requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
