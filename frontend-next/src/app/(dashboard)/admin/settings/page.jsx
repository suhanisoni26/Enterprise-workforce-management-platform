"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2 block">
          Configuration
        </span>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Organization Settings
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage your company details, security policies, and billing.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 space-y-1">
          {["General", "Security", "Notifications", "Billing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-indigo-700 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === "General" && (
            <div className="space-y-6 max-w-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Profile</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
                <input type="text" defaultValue="Nexora Enterprise" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                <input type="email" defaultValue="support@nexora.com" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  <option>UTC - Coordinated Universal Time</option>
                  <option>EST - Eastern Standard Time</option>
                  <option>PST - Pacific Standard Time</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-lg transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="space-y-6 max-w-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Policies</h2>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-500 mt-1">Require 2FA for all administrator accounts.</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-indigo-500 transform translate-x-5" />
                  <label className="toggle-label block overflow-hidden h-5 rounded-full bg-indigo-500 cursor-pointer"></label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Session Timeout</h3>
                  <p className="text-xs text-gray-500 mt-1">Automatically log out inactive users.</p>
                </div>
                <select className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700">
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>4 Hours</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg mt-8">
                <div>
                  <h3 className="text-sm font-medium text-red-900">Purge Data</h3>
                  <p className="text-xs text-red-700 mt-1">Permanently delete all inactive employee records.</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors shadow-sm">
                  Purge
                </button>
              </div>
            </div>
          )}

          {(activeTab === "Notifications" || activeTab === "Billing") && (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div className="space-y-3">
                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p>This module is currently under construction.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
