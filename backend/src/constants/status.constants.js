/**
 * Status Constants
 * User and Employee status values.
 */

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
  ARCHIVED: 'archived',
};

const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  ON_LEAVE: 'on_leave',
  PROBATION: 'probation',
  TERMINATED: 'terminated',
  RESIGNED: 'resigned',
  ARCHIVED: 'archived',
};

const EMPLOYMENT_TYPE = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERN: 'intern',
};

module.exports = { USER_STATUS, EMPLOYEE_STATUS, EMPLOYMENT_TYPE };
