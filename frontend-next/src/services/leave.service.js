/**
 * Leave Service
 * Frontend API calls for leave management endpoints.
 */

import api from './api';

const leaveService = {
  /**
   * Get all leave requests (admin/hr/manager view).
   * Optional status filter: 'pending', 'approved', 'rejected'.
   */
  getAll: async (status = '') => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/leave${params}`);
    return response.data;
  },

  /**
   * Get the current user's leave requests.
   */
  getMy: async () => {
    const response = await api.get('/leave/my');
    return response.data;
  },

  /**
   * Get leave stats (pending, approved, rejected counts).
   */
  getStats: async () => {
    const response = await api.get('/leave/stats');
    return response.data;
  },

  /**
   * Submit a new leave request.
   */
  create: async (leaveData) => {
    const response = await api.post('/leave', leaveData);
    return response.data;
  },

  /**
   * Approve a pending leave request.
   */
  approve: async (id, comment = '') => {
    const response = await api.patch(`/leave/${id}/approve`, { comment });
    return response.data;
  },

  /**
   * Reject a pending leave request.
   */
  reject: async (id, comment = '') => {
    const response = await api.patch(`/leave/${id}/reject`, { comment });
    return response.data;
  },
};

export default leaveService;
