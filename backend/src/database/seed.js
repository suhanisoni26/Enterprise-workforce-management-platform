/**
 * Database Seed Script
 * Creates initial Super Admin user and default departments.
 * Run: node src/database/seed.js
 */

const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const Department = require('../models/Department.model');
const { hashPassword } = require('../utils/password.util');
const { ROLES } = require('../constants/roles.constants');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // ─── Default Departments ───────────────────────
    const departments = [
      { departmentCode: 'HR', departmentName: 'Human Resources', description: 'HR and People Operations' },
      { departmentCode: 'ENG', departmentName: 'Engineering', description: 'Software Development & IT' },
      { departmentCode: 'FIN', departmentName: 'Finance', description: 'Finance & Accounting' },
      { departmentCode: 'MKT', departmentName: 'Marketing', description: 'Marketing & Communications' },
      { departmentCode: 'OPS', departmentName: 'Operations', description: 'Business Operations' },
      { departmentCode: 'IT', departmentName: 'Information Technology', description: 'IT Administration & Support' },
    ];

    for (const dept of departments) {
      const exists = await Department.findOne({ departmentCode: dept.departmentCode });
      if (!exists) {
        await Department.create(dept);
        console.log(`  📁 Created department: ${dept.departmentName}`);
      } else {
        console.log(`  ⏭️  Department exists: ${dept.departmentName}`);
      }
    }

    // ─── Seed 9 Demo Roles ─────────────────────────
    const demoUsers = [
      { role: ROLES.SUPER_ADMIN, email: 'superadmin@ewm.edu', firstName: 'Super', lastName: 'Admin', empId: 'EMP-1001' },
      { role: ROLES.ORG_ADMIN, email: 'orgadmin@ewm.edu', firstName: 'Org', lastName: 'Admin', empId: 'EMP-1002' },
      { role: ROLES.HR_MANAGER, email: 'hr@ewm.edu', firstName: 'HR', lastName: 'Manager', empId: 'EMP-1003' },
      { role: ROLES.MANAGER, email: 'manager@ewm.edu', firstName: 'Project', lastName: 'Manager', empId: 'EMP-1004' },
      { role: ROLES.TEAM_LEAD, email: 'teamlead@ewm.edu', firstName: 'Team', lastName: 'Lead', empId: 'EMP-1005' },
      { role: ROLES.EMPLOYEE, email: 'employee@ewm.edu', firstName: 'Regular', lastName: 'Employee', empId: 'EMP-1006' },
      { role: ROLES.FINANCE, email: 'finance@ewm.edu', firstName: 'Finance', lastName: 'Officer', empId: 'EMP-1007' },
      { role: ROLES.IT_ADMIN, email: 'itadmin@ewm.edu', firstName: 'IT', lastName: 'Admin', empId: 'EMP-1008' },
      { role: ROLES.AUDITOR, email: 'auditor@ewm.edu', firstName: 'External', lastName: 'Auditor', empId: 'EMP-1009' }
    ];

    const defaultPassword = 'DemoPass@123';
    const hashedDemoPass = await hashPassword(defaultPassword);

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        // Create Employee
        const joinDate = new Date();
        joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 365));

        await Employee.create({
          employeeId: u.empId,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          designation: u.role.replace('_', ' '),
          employmentType: 'full_time',
          salary: Math.floor(Math.random() * (150000 - 50000 + 1)) + 50000,
          joiningDate: joinDate,
        });

        // Create User
        await User.create({
          employeeId: u.empId,
          email: u.email,
          password: hashedDemoPass,
          role: u.role,
          isActive: true,
          mustChangePassword: false,
          isFirstLogin: false,
        });
        console.log(`  👤 Seeded ${u.role} demo account: ${u.email}`);
      } else {
        console.log(`  ⏭️  Demo user exists for role ${u.role}: ${u.email}`);
      }
    }

    console.log('\n🎉 Database seeding completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
