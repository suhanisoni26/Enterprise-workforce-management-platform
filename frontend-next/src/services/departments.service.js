/**
 * Department Service
 * Frontend API calls for department management endpoints.
 */

import api from './api';

const departmentService = {
  /**
   * Get all departments.
   */
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  /**
   * Get a single department by ID.
   */
  getById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  /**
   * Create a new department.
   */
  create: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  /**
   * Update a department.
   */
  update: async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData);
    return response.data;
  },

  /**
   * Delete (soft-deactivate) a department.
   */
  delete: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};

export default departmentService;
