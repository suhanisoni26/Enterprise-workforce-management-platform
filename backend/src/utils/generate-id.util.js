/**
 * Employee ID Generator
 * Generates unique employee IDs in the format EMP-XXXX.
 */

const Employee = require('../models/Employee.model');

/**
 * Generate the next employee ID.
 * Finds the last employee and increments the number.
 * @returns {Promise<string>} e.g., "EMP-0001"
 */
const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne({})
    .sort({ createdAt: -1 })
    .select('employeeId');

  if (!lastEmployee || !lastEmployee.employeeId) {
    return 'EMP-0001';
  }

  const lastNumber = parseInt(lastEmployee.employeeId.split('-')[1], 10);
  const nextNumber = lastNumber + 1;
  return `EMP-${String(nextNumber).padStart(4, '0')}`;
};

module.exports = { generateEmployeeId };
