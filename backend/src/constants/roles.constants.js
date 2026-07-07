/**
 * User Roles Constants
 * All available roles in the platform.
 */

const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  HR_MANAGER: 'HR_MANAGER',
  MANAGER: 'MANAGER',
  TEAM_LEAD: 'TEAM_LEAD',
  EMPLOYEE: 'EMPLOYEE',
  FINANCE: 'FINANCE',
  IT_ADMIN: 'IT_ADMIN',
  AUDITOR: 'AUDITOR',
};

const ROLES_ARRAY = Object.values(ROLES);

// Admin roles that can create employees
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER];

// Roles hierarchy (higher index = more privileges)
const ROLE_HIERARCHY = {
  [ROLES.EMPLOYEE]: 1,
  [ROLES.TEAM_LEAD]: 2,
  [ROLES.MANAGER]: 3,
  [ROLES.HR_MANAGER]: 4,
  [ROLES.FINANCE]: 4,
  [ROLES.IT_ADMIN]: 4,
  [ROLES.AUDITOR]: 4,
  [ROLES.ORG_ADMIN]: 5,
  [ROLES.SUPER_ADMIN]: 6,
};

module.exports = { ROLES, ROLES_ARRAY, ADMIN_ROLES, ROLE_HIERARCHY };
