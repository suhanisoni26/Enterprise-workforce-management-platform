"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import departmentService from "@/services/departments.service";
import employeeService from "@/services/employees.service";

export default function AdminDepartmentsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Form state
  const [form, setForm] = useState({
    departmentCode: "",
    departmentName: "",
    description: "",
    managerId: "",
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getAll();
      setDepartments(res.data?.departments || []);
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getAll({ limit: 200, status: "active" });
      setEmployees(res.data || []);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setForm({ departmentCode: "", departmentName: "", description: "", managerId: "" });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setForm({
      departmentCode: dept.departmentCode || "",
      departmentName: dept.departmentName || "",
      description: dept.description || "",
      managerId: dept.managerId || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentService.update(editingDept._id, {
          departmentName: form.departmentName,
          description: form.description,
          managerId: form.managerId || null,
        });
        toast.success("Department updated successfully");
      } else {
        await departmentService.create(form);
        toast.success("Department created successfully");
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDeactivate = async (dept) => {
    if (!confirm(`Are you sure you want to deactivate "${dept.departmentName}"?`)) return;
    try {
      await departmentService.delete(dept._id);
      toast.success("Department deactivated");
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate");
    }
  };

  const handleReactivate = async (dept) => {
    try {
      await departmentService.update(dept._id, { status: "active" });
      toast.success("Department reactivated");
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reactivate");
    }
  };

  // Find manager name helper
  const getManagerName = (managerId) => {
    if (!managerId) return "Not Assigned";
    const emp = employees.find(
      (e) => e.employeeId === managerId || e._id === managerId
    );
    return emp
      ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.employeeId
      : managerId;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Organization
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Departments
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage the hierarchical structure of your organization and department leads.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <span>+</span> Add Department
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No departments yet</h3>
          <p className="text-sm text-gray-500">Create your first department to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className={`bg-white rounded-xl border p-6 shadow-sm hover:border-indigo-200 transition-colors group ${
                dept.status === "inactive" ? "border-red-200 opacity-70" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                {/* Actions dropdown */}
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all p-1"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {dept.status === "active" ? (
                    <button
                      onClick={() => handleDeactivate(dept)}
                      className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Deactivate"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(dept)}
                      className="text-gray-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Reactivate"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{dept.departmentName}</h3>
                {dept.status === "inactive" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700">INACTIVE</span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono mb-1">{dept.departmentCode}</p>
              <p className="text-sm text-gray-500 mb-6">
                {dept.employeeCount ?? 0} Employee{(dept.employeeCount ?? 0) !== 1 ? "s" : ""}
              </p>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase mb-0.5">Dept Head</p>
                  <p className="text-sm font-medium text-gray-900">{getManagerName(dept.managerId)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase mb-0.5">Status</p>
                  <p className={`text-sm font-medium ${dept.status === "active" ? "text-emerald-600" : "text-red-600"}`}>
                    {dept.status === "active" ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingDept ? "Edit Department" : "New Department"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editingDept ? "Update department details below." : "Fill in the details to create a new department."}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {!editingDept && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Code</label>
                  <input
                    type="text"
                    required
                    value={form.departmentCode}
                    onChange={(e) => setForm({ ...form, departmentCode: e.target.value })}
                    placeholder="e.g. ENG, HR, MKT"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Name</label>
                <input
                  type="text"
                  required
                  value={form.departmentName}
                  onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
                  placeholder="e.g. Engineering"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the department"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department Head</label>
                <select
                  value={form.managerId}
                  onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">— No Head Assigned —</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm"
                >
                  {editingDept ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
