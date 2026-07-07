"use client";

import { useAuth } from "@/hooks/useAuth";

export default function EmployeeAttendancePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Time & Attendance
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            My Attendance
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Track your daily clock-ins, shift hours, and weekly summaries.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Currently Clocked In
          </div>
          <button className="px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm">
            Clock Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-6">Timesheet (This Week)</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                    <th className="px-4 py-3">Clock In</th>
                    <th className="px-4 py-3">Clock Out</th>
                    <th className="px-4 py-3">Total Hours</th>
                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { date: 'Mon, Oct 12', in: '09:02 AM', out: '05:30 PM', hrs: '8h 28m', status: 'Present', color: 'bg-emerald-100 text-emerald-800' },
                    { date: 'Tue, Oct 13', in: '08:55 AM', out: '06:05 PM', hrs: '9h 10m', status: 'Present', color: 'bg-emerald-100 text-emerald-800' },
                    { date: 'Wed, Oct 14', in: '09:15 AM', out: '--:--', hrs: '4h 12m', status: 'Active', color: 'bg-blue-100 text-blue-800' },
                    { date: 'Thu, Oct 15', in: '--', out: '--', hrs: '0h', status: 'Upcoming', color: 'bg-gray-100 text-gray-800' },
                    { date: 'Fri, Oct 16', in: '--', out: '--', hrs: '0h', status: 'Upcoming', color: 'bg-gray-100 text-gray-800' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">{row.date}</td>
                      <td className="px-4 py-4">{row.in}</td>
                      <td className="px-4 py-4">{row.out}</td>
                      <td className="px-4 py-4 font-medium">{row.hrs}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a0a0b] rounded-xl border border-gray-800 p-8 shadow-sm relative overflow-hidden text-white">
            <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">Weekly Summary</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-semibold tracking-tighter">21.5</span>
              <span className="text-lg text-gray-400 font-medium mb-1">hrs</span>
            </div>
            <p className="text-sm text-indigo-400 font-medium mb-6">Of 40 hours target</p>
            
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '55%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase mb-4">Shift Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Current Shift</span>
                <span className="text-sm font-medium text-gray-900">Morning (09:00 - 17:00)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Manager</span>
                <span className="text-sm font-medium text-indigo-600">Sarah Jenkins</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Location</span>
                <span className="text-sm font-medium text-gray-900">HQ - Floor 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
