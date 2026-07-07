"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import leaveService from "@/services/leave.service";

export default function EmployeeLeavePage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    leaveType: "annual",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveService.getMy();
      setLeaves(res.data?.leaves || []);
    } catch (err) {
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leaveService.create(form);
      toast.success("Leave request submitted!");
      setShowModal(false);
      setForm({ leaveType: "annual", startDate: "", endDate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  // Aggregate balances from approved leaves (simple calculation)
  const balances = [
    {
      label: "Annual Leave",
      key: "annual",
      total: 20,
      color: "bg-indigo-500",
    },
    { label: "Sick Leave", key: "sick", total: 10, color: "bg-emerald-500" },
    {
      label: "Personal Leave",
      key: "personal",
      total: 3,
      color: "bg-orange-500",
    },
  ];

  const usedDays = (type) =>
    leaves
      .filter((l) => l.leaveType === type && l.status === "approved")
      .reduce((sum, l) => sum + (l.totalDays || 0), 0);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  };

  const leaveTypeLabels = {
    annual: "Annual Leave",
    sick: "Sick Leave",
    personal: "Personal Leave",
    unpaid: "Unpaid Leave",
    other: "Other",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Time Off
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Leave Requests
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your time off, track approvals, and view your remaining
            balance.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <span>+</span> New Request
        </button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {balances.map((leave, i) => {
          const used = usedDays(leave.key);
          const remaining = Math.max(0, leave.total - used);
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                {leave.label}
              </h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-semibold tracking-tight text-gray-900">
                  {remaining}
                </span>
                <span className="text-sm font-medium text-gray-400 mb-1">
                  / {leave.total} days
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                <div
                  className={`${leave.color} h-1.5 rounded-full transition-all`}
                  style={{
                    width: `${(remaining / leave.total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-6">
          Request History
        </h2>

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Loading...
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No leave requests yet. Submit your first request above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {leaveTypeLabels[row.leaveType] || row.leaveType}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(row.startDate)}
                      {row.startDate !== row.endDate &&
                        ` - ${formatDate(row.endDate)}`}
                    </td>
                    <td className="px-4 py-4">
                      {row.totalDays} day{row.totalDays !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {row.reason || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                          statusColors[row.status] || ""
                        }`}
                      >
                        {row.status?.charAt(0).toUpperCase() +
                          row.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                New Leave Request
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Submit a time-off request for approval.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Leave Type
                </label>
                <select
                  required
                  value={form.leaveType}
                  onChange={(e) =>
                    setForm({ ...form, leaveType: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reason
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                  placeholder="Brief reason for leave"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
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
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm disabled:opacity-70"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
