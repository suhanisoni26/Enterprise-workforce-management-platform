/**
 * Employee Service
 * Frontend API calls for employee management endpoints.
 */

import api from './api';

const employeeService = {
  /**
   * Get all employees with optional filters and pagination.
   */
  getAll: async ({ page = 1, limit = 20, search = '', status = '', departmentId = '', employmentType = '' } = {}) => {
    const params = new URLSearchParams();
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (departmentId) params.set('departmentId', departmentId);
    if (employmentType) params.set('employmentType', employmentType);

    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single employee by their employeeId.
   */
  getById: async (employeeId) => {
    const response = await api.get(`/employees/${employeeId}`);
    return response.data;
  },

  /**
   * Get employee stats for dashboards.
   */
  getStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },

  /**
   * Get end-to-end rich analytics (revenue, payroll, growth).
   */
  getAnalytics: async () => {
    const response = await api.get('/employees/analytics');
    return response.data;
  },

  /**
   * Deactivate an employee account.
   */
  deactivate: async (employeeId) => {
    const response = await api.patch(`/employees/${employeeId}/deactivate`);
    return response.data;
  },

  /**
   * Reactivate a previously deactivated employee.
   */
  activate: async (employeeId) => {
    const response = await api.patch(`/employees/${employeeId}/activate`);
    return response.data;
  },

  /**
   * Create a new employee (delegates to auth.service createEmployee).
   */
  create: async (employeeData) => {
    const response = await api.post('/auth/create-employee', employeeData);
    return response.data;
  },
};

export default employeeService;
