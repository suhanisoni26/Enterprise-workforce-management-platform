"use client";

export default function EmployeePayrollPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Compensation
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Payroll & Payslips
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            View your salary details, upcoming payouts, and historical tax documents.
          </p>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-0.5">Next Payout</p>
            <p className="text-lg font-bold text-gray-900">Oct 31, 2026</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Recent Payslips</h2>
          
          <div className="space-y-4">
            {[
              { month: 'September 2026', date: 'Sep 30, 2026', net: '$4,250.00', status: 'Paid' },
              { month: 'August 2026', date: 'Aug 31, 2026', net: '$4,250.00', status: 'Paid' },
              { month: 'July 2026', date: 'Jul 31, 2026', net: '$4,250.00', status: 'Paid' },
              { month: 'June 2026', date: 'Jun 30, 2026', net: '$4,500.00', status: 'Paid', note: 'Includes Q2 Bonus' },
            ].map((slip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-200 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{slip.month}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500">Issued on {slip.date}</p>
                      {slip.note && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">{slip.note}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Net Pay</p>
                    <p className="font-bold text-gray-900">{slip.net}</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-32 h-32 transform translate-x-8 -translate-y-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Current Base Salary</h3>
            <p className="text-3xl font-bold tracking-tight mb-6">$85,000 <span className="text-sm font-normal text-gray-400">/ yr</span></p>
            
            <div className="space-y-3 border-t border-gray-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax Status</span>
                <span className="font-medium text-gray-200">Single, 0 Allowances</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Bank Account</span>
                <span className="font-medium text-gray-200">Chase (**** 1234)</span>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 rounded-lg transition-colors">
              Update Tax Info
            </button>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tax Documents</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">2025 W-2 Form</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">2024 W-2 Form</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
