/**
 * Analytics Controller
 * Handles aggregation of data for the analytics dashboard (headcount, payroll, revenue).
 */

const Employee = require('../models/Employee.model');
const Department = require('../models/Department.model');
const { sendSuccess } = require('../utils/response.util');

/**
 * GET /api/employees/analytics
 * Retrieve rich analytics data for dashboard charts.
 */
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1); // Start of the month 11 months ago

    // 1. Headcount Growth & Revenue Mock Data (Last 12 months)
    const employees = await Employee.find({ 
      joiningDate: { $gte: twelveMonthsAgo } 
    }).select('joiningDate');

    const monthsMap = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize the last 12 months with 0
    let curr = new Date(twelveMonthsAgo);
    const now = new Date();
    while (curr <= now) {
      const key = `${monthNames[curr.getMonth()]} ${curr.getFullYear().toString().substring(2)}`;
      monthsMap[key] = { hires: 0, payroll: 0 };
      curr.setMonth(curr.getMonth() + 1);
    }

    employees.forEach(emp => {
      const date = new Date(emp.joiningDate);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
      if (monthsMap[key]) {
        monthsMap[key].hires += 1;
      }
    });

    // Format chart data for growth
    const growthData = Object.keys(monthsMap).map(key => ({
      name: key,
      hires: monthsMap[key].hires
    }));

    // 2. Department Costs (Payroll by Department)
    const deptCostsRaw = await Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$departmentId', totalPayroll: { $sum: '$salary' } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
      { $project: { departmentName: { $ifNull: ['$dept.departmentName', 'Unassigned'] }, totalPayroll: 1 } },
      { $sort: { totalPayroll: -1 } }
    ]);

    const departmentCosts = deptCostsRaw.map(d => ({
      name: d.departmentName,
      value: d.totalPayroll || 0
    }));

    // 3. Overall Stats
    const totalActiveEmployees = await Employee.countDocuments({ status: 'active' });
    const totalHistoricalEmployees = await Employee.countDocuments({});
    
    // Calculate total active payroll
    const activePayrollAggr = await Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$salary' } } }
    ]);
    const totalPayroll = activePayrollAggr.length > 0 ? activePayrollAggr[0].total : 0;

    const retentionRate = totalHistoricalEmployees > 0 
      ? Math.round((totalActiveEmployees / totalHistoricalEmployees) * 100) 
      : 0;

    // 4. Generate Mock Revenue Data based on Payroll over the last 12 months
    // We assume a base historical payroll and scale it up based on hires, then generate revenue as 1.5x - 2.5x of payroll.
    let cumulativePayroll = totalPayroll * 0.7; // Just a mock starting point 12 months ago
    const revenueData = growthData.map(month => {
      // For each new hire in that month, increase cumulative payroll
      cumulativePayroll += month.hires * 5000; // rough average monthly salary
      // Random multiplier between 1.5 and 2.5
      const revenueMultiplier = 1.5 + Math.random(); 
      const monthlyRevenue = cumulativePayroll * revenueMultiplier;
      return {
        name: month.name,
        payroll: Math.round(cumulativePayroll),
        revenue: Math.round(monthlyRevenue)
      };
    });

    const revenueYTD = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);

    return sendSuccess(res, {
      growthData,
      departmentCosts,
      revenueData,
      stats: {
        totalPayroll,
        revenueYTD,
        retentionRate,
      }
    }, 'Analytics fetched successfully', 200);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
};
