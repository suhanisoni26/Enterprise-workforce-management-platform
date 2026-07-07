"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ManagerTeamPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            My Team
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Direct Reports
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            View performance, manage workloads, and support your team members.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm flex items-center gap-2">
            Schedule 1:1
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Alex Johnson', role: 'Frontend Developer', status: 'Online', performance: 'Exceptional', tasks: 12 },
          { name: 'Maria Garcia', role: 'Backend Developer', status: 'In a meeting', performance: 'Exceeds Expectations', tasks: 8 },
          { name: 'James Smith', role: 'UI/UX Designer', status: 'Offline', performance: 'Meets Expectations', tasks: 5 },
          { name: 'Linda Chen', role: 'QA Engineer', status: 'Online', performance: 'Exceeds Expectations', tasks: 15 },
        ].map((member, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600">
                    {member.name.charAt(0)}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${member.status === 'Online' ? 'bg-emerald-500' : member.status === 'Offline' ? 'bg-gray-400' : 'bg-amber-500'}`}></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <div className="mt-auto space-y-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Active Tasks</span>
                <span className="font-medium text-gray-900">{member.tasks}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Performance</span>
                <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{member.performance}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                Message
              </button>
              <button className="flex-1 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
