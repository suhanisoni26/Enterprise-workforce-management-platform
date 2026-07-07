"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Manager Workspace
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Welcome back, {user?.email?.split('@')[0] || 'Manager'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Here's an overview of your department's performance and pending tasks.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Team Members", value: "24", change: "+2 this month" },
          { label: "Pending Leaves", value: "3", change: "Requires attention" },
          { label: "Average Attendance", value: "94%", change: "+1.2% from last week" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{kpi.label}</h3>
            <p className="text-3xl font-semibold text-gray-900 mt-2 tracking-tight">{kpi.value}</p>
            <p className="text-xs text-indigo-600 font-medium mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-4">Pending Approvals</h2>
        <div className="space-y-4">
          {[
            { name: 'Sarah Jenkins', type: 'Annual Leave', date: 'Oct 12 - Oct 15' },
            { name: 'Michael Chen', type: 'Sick Leave', date: 'Oct 02' },
          ].map((leave, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-indigo-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{leave.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{leave.type} &bull; {leave.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors">Approve</button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
