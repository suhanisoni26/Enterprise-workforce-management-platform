"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import leaveService from "@/services/leave.service";

export default function ManagerApprovalsPage() {
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
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
            Inbox
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Approvals
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Review and act on leave requests from your team members.
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

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
            <p className="text-sm text-gray-400">Loading requests...</p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No {activeFilter} requests
            </h3>
            <p className="text-sm text-gray-500">
              You're all caught up in this view.
            </p>
          </div>
        ) : (
          leaves.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center transition-shadow hover:shadow-md"
            >
              <div className="flex gap-4 items-start">
                <div
                  className={`p-3 rounded-lg ${
                    req.leaveType === "sick"
                      ? "bg-red-50 text-red-600"
                      : req.leaveType === "personal"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {req.employeeName || req.employeeId}
                    </h3>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm font-medium text-gray-700">
                      {leaveTypeLabels[req.leaveType] || req.leaveType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">
                      {formatDate(req.startDate)}
                      {req.startDate !== req.endDate &&
                        ` - ${formatDate(req.endDate)}`}
                    </span>{" "}
                    ({req.totalDays} day{req.totalDays !== 1 ? "s" : ""})
                  </p>
                  {req.reason && (
                    <div className="text-xs text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded italic">
                      &quot;{req.reason}&quot;
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                  {timeAgo(req.createdAt)}
                </span>

                {activeFilter === "pending" ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleReject(req._id)}
                      className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                      req.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
