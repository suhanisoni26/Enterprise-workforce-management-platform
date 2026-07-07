"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import leaveService from "@/services/leave.service";

export default function AdminLeavePage() {
  const [activeFilter, setActiveFilter] = useState("pending");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const [leavesRes, statsRes] = await Promise.all([
        leaveService.getAll(activeFilter),
        leaveService.getStats(),
      ]);
      setLeaves(leavesRes.data?.leaves || []);
      setStats(statsRes.data || { pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [activeFilter]);

  const handleApprove = async (id) => {
    try {
      await leaveService.approve(id);
      toast.success("Leave request approved");
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await leaveService.reject(id);
      toast.success("Leave request rejected");
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const timeAgo = (d) => {
    if (!d) return "";
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const leaveTypeLabels = {
    annual: "Annual Leave",
    sick: "Sick Leave",
    personal: "Personal Leave",
    unpaid: "Unpaid Leave",
    other: "Other",
  };

  const filterTabs = [
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "approved", label: "Approved", count: stats.approved },
    { key: "rejected", label: "Rejected", count: stats.rejected },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            HR Management
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Leave Management
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Review, approve, and reject leave requests across the organization.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}{" "}
              {tab.count > 0 && (
                <span className="ml-1.5 bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
          <p className="text-3xl font-semibold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Approved</p>
          <p className="text-3xl font-semibold text-emerald-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Rejected</p>
          <p className="text-3xl font-semibold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Leave request list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeFilter} requests</h3>
            <p className="text-sm text-gray-500">All clear for now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Dates</th>
                  <th className="px-6 py-3">Days</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Submitted</th>
                  {activeFilter === "pending" && <th className="px-6 py-3 text-right">Actions</th>}
                  {activeFilter !== "pending" && <th className="px-6 py-3">Reviewed By</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {req.employeeName || req.employeeId}
                    </td>
                    <td className="px-6 py-4">
                      {leaveTypeLabels[req.leaveType] || req.leaveType}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(req.startDate)}
                      {req.startDate !== req.endDate && ` – ${formatDate(req.endDate)}`}
                    </td>
                    <td className="px-6 py-4">{req.totalDays}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-[180px] truncate">{req.reason || "—"}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{timeAgo(req.createdAt)}</td>
                    {activeFilter === "pending" ? (
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleReject(req._id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(req._id)}
                            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    ) : (
                      <td className="px-6 py-4 text-gray-500 text-xs">{req.reviewerEmail || "—"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
