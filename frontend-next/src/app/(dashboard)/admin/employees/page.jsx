"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import employeeService from "@/services/employees.service";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function AdminEmployeesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch departments for filter dropdown
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get("/departments");
        if (res.data?.success) {
          setDepartments(res.data.data.departments || []);
        }
      } catch (err) {
        console.warn("Failed to fetch departments for filter:", err.message);
      }
    };
    fetchDepts();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll({
        page,
        limit: 10,
        search,
        departmentId: deptFilter,
      });
      if (data?.success) {
        setEmployees(data.data.employees || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
        setTotalCount(data.data.pagination?.total || 0);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, deptFilter]);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchEmployees();
    }
  };

  const handleToggleStatus = async (emp) => {
    const isCurrentlyActive = emp.accountActive;
    try {
      if (isCurrentlyActive) {
        await employeeService.deactivate(emp.employeeId);
        toast.success(`Deactivated ${emp.firstName} successfully.`);
      } else {
        await employeeService.activate(emp.employeeId);
        toast.success(`Reactivated ${emp.firstName} successfully.`);
      }
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Workforce
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your organization's entire workforce across all departments.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/admin/employees/new')}
            className="px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+</span> New Employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search & press Enter..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select 
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
            <button 
              onClick={() => {
                setPage(1);
                fetchEmployees();
              }}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading workforce directory...</div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No employees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                          {emp.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[11px] text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{emp.designation || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-500">{emp.departmentId?.departmentName || "Unassigned"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                        emp.accountActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {emp.accountActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => router.push(`/admin/employees/${emp.employeeId}/edit`)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-2 py-1"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(emp)}
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          emp.accountActive 
                            ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                            : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                        }`}
                      >
                        {emp.accountActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 text-sm text-gray-500">
          <span>Showing Page {page} of {totalPages} ({totalCount} employees total)</span>
          <div className="flex gap-1">
            <button 
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
