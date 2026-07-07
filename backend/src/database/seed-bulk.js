/**
 * Bulk Seed Script
 * Generates bulk mock data (employees and leave requests) for enterprise testing.
 * Run: node src/database/seed-bulk.js
 */

const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const Department = require('../models/Department.model');
const LeaveRequest = require('../models/LeaveRequest.model');
const { hashPassword } = require('../utils/password.util');
const { ROLES } = require('../constants/roles.constants');

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedBulkData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB for Bulk Seeding');

    const departments = await Department.find();
    if (departments.length === 0) {
      console.error('❌ No departments found. Please run seed.js first.');
      process.exit(1);
    }

    const defaultPassword = 'DemoPass@123';
    const hashedDemoPass = await hashPassword(defaultPassword);

    console.log('⏳ Generating Employees...');
    const generatedEmployees = [];

    // Generate 100 Employees
    for (let i = 1; i <= 100; i++) {
      const fn = getRandomElement(firstNames);
      const ln = getRandomElement(lastNames);
      const empId = `EMP-2${i.toString().padStart(3, '0')}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@ewm.edu`;
      const dept = getRandomElement(departments);

      const exists = await Employee.findOne({ email });
      if (!exists) {
        const joinDate = new Date();
        joinDate.setDate(joinDate.getDate() - getRandomInt(1, 365));

        const emp = await Employee.create({
          employeeId: empId,
          firstName: fn,
          lastName: ln,
          email: email,
          departmentId: dept._id,
          designation: 'Staff',
          employmentType: 'full_time',
          phone: `555-${getRandomInt(1000, 9999)}`,
          status: 'active',
          salary: getRandomInt(50000, 150000),
          joiningDate: joinDate
        });
        
        await User.create({
          employeeId: empId,
          email: email,
          password: hashedDemoPass,
          role: ROLES.EMPLOYEE,
          isActive: true,
          mustChangePassword: false,
          isFirstLogin: false,
        });

        generatedEmployees.push(emp);
      }
    }
    console.log(`✅ Created ${generatedEmployees.length} mock employees & users.`);

    console.log('⏳ Generating Leave Requests...');
    const leaveTypes = ['annual', 'sick', 'personal', 'unpaid'];
    let leavesCreated = 0;

    for (let i = 0; i < 150; i++) {
      const emp = getRandomElement(generatedEmployees);
      if (!emp) continue;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + getRandomInt(-30, 30));
      
      const endDate = new Date(startDate);
      const totalDays = getRandomInt(1, 5);
      endDate.setDate(endDate.getDate() + totalDays);

      await LeaveRequest.create({
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        leaveType: getRandomElement(leaveTypes),
        startDate,
        endDate,
        totalDays,
        reason: 'Generated mock leave request for testing',
        status: getRandomElement(['pending', 'approved', 'rejected']),
      });
      leavesCreated++;
    }

    console.log(`✅ Created ${leavesCreated} mock leave requests.`);
    console.log('\n🎉 Bulk Data Seeding Completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Bulk Seed error:', error.message);
    process.exit(1);
  }
};

seedBulkData();
