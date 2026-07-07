# Enterprise Workforce Management Platform with AI Operations Assistant

> Version: 1.0
> Document Type: Database & Authentication Engineering
> Database: MongoDB
> Authentication: JWT + Refresh Token + RBAC

---

# Table of Contents

1. Purpose
2. Database Philosophy
3. Database Architecture
4. Collections Overview
5. Collection Relationships
6. MongoDB Naming Standards
7. Authentication Architecture
8. Employee Lifecycle
9. User Lifecycle
10. JWT Strategy
11. Refresh Token Strategy
12. Password Management
13. Role-Based Access Control
14. Database Indexing
15. Audit Logging
16. Security Rules
17. Collection Schemas
18. Engineering Rules

---

# 1. Purpose

This document defines the complete database architecture and authentication system for the Enterprise Workforce Management Platform.

It acts as the single source of truth for:

- MongoDB Collections
- Mongoose Models
- Authentication
- Authorization
- JWT
- Refresh Tokens
- User Lifecycle
- Employee Lifecycle
- Security

---

# 2. Database Philosophy

The database must be:

- Normalized where appropriate
- Easy to scale
- Easy to query
- Secure
- Audit-friendly
- Future microservice compatible

Each business domain owns its own collection.

---

# 3. Database Architecture

```text
Application

↓

Express Backend

↓

Mongoose ODM

↓

MongoDB

↓

Collections

Users
Employees
Departments
Attendance
Leave
Payroll
Candidates
Projects
Tasks
Assets
Documents
Notifications
AuditLogs
```

---

# 4. Collections Overview

| Collection | Purpose |
|------------|---------|
| users | Authentication & Login |
| employees | Employee Profile |
| departments | Organization Structure |
| attendance | Daily Attendance |
| leaveRequests | Leave Applications |
| payrolls | Salary Processing |
| candidates | Recruitment |
| projects | Project Management |
| tasks | Task Management |
| assets | Company Assets |
| documents | Uploaded Files |
| notifications | Alerts |
| auditLogs | System Activity |

---

# 5. Collection Relationships

```text
Department

│

├── Employees

│       │

│       ├── Attendance

│       ├── Leave

│       ├── Payroll

│       ├── Projects

│       └── Documents

Projects

│

└── Tasks

Users

│

└── Roles
```

---

# 6. MongoDB Naming Standards

Collections

```
users

employees

departments

attendance

leaveRequests

payrolls

projects
```

Field Names

camelCase

Example

```
employeeId

joiningDate

reportingManager

createdAt

updatedAt
```

---

# 7. Authentication Architecture

```text
Employee Opens Login Page

↓

Enter Email & Password

↓

Validation Middleware

↓

Authentication Service

↓

Find User

↓

Compare Password (bcrypt)

↓

Generate Access Token

↓

Generate Refresh Token

↓

Save Session

↓

Return Tokens

↓

Dashboard
```

---

# 8. Employee Lifecycle

```text
Candidate

↓

Interview

↓

Offer Letter

↓

HR Creates Employee

↓

Employee Record Created

↓

User Account Created

↓

Temporary Password

↓

Welcome Email

↓

First Login

↓

Mandatory Password Change

↓

Employee Dashboard
```

---

# 9. User Lifecycle

```text
User Created

↓

Inactive

↓

Email Verification (Optional)

↓

First Login

↓

Password Change

↓

Active

↓

Password Reset

↓

Locked

↓

Archived
```

---

# 10. JWT Strategy

Access Token

- Short expiry (15–30 minutes)

Contains:

- User ID
- Role
- Organization ID
- Employee ID

Refresh Token

- Long expiry (7–30 days)

Stored securely.

---

# 11. Refresh Token Flow

```text
Access Token Expired

↓

Client Sends Refresh Token

↓

Verify Refresh Token

↓

Generate New Access Token

↓

Return New Token

↓

Continue Session
```

---

# 12. Password Management

Passwords must:

- Minimum 8 characters
- Uppercase
- Lowercase
- Number
- Special Character

Stored using:

```
bcrypt
```

Never store plain text passwords.

---

# 13. Role-Based Access Control

Available Roles

```text
SUPER_ADMIN

ORG_ADMIN

HR_MANAGER

MANAGER

TEAM_LEAD

EMPLOYEE

FINANCE

IT_ADMIN

AUDITOR
```

Permission Example

| Role | Employee CRUD | Payroll | Reports |
|------|---------------|----------|----------|
| Super Admin | ✔ | ✔ | ✔ |
| HR | ✔ | Read | ✔ |
| Manager | Read | No | Team Only |
| Employee | Self | Own | Own |
| Finance | Read | ✔ | Payroll |
| Auditor | Read | Read | Read |

---

# 14. Database Indexing

Create indexes on:

```
email

employeeId

departmentId

projectId

candidateEmail

createdAt
```

Unique Indexes

```
email

employeeId

departmentCode
```

---

# 15. Audit Logging

Every sensitive action must be logged.

Fields

```text
User ID

Role

Action

Entity

Entity ID

IP Address

Timestamp

Status
```

Example

```
HR created Employee EMP1045

2026-07-01 09:10 AM
```

---

# 16. Security Rules

Mandatory

- bcrypt
- JWT
- Refresh Tokens
- HTTPS
- Helmet
- CORS
- Rate Limiting
- Input Validation
- Audit Logs
- Session Timeout
- Account Lock after 5 failed attempts

---

# 17. Collection Schemas

## Users

```javascript
{
  _id,
  employeeId,
  email,
  password,
  role,
  isActive,
  failedLoginAttempts,
  refreshToken,
  lastLogin,
  createdAt,
  updatedAt
}
```

---

## Employees

```javascript
{
  _id,
  employeeId,
  firstName,
  lastName,
  email,
  phone,
  departmentId,
  designation,
  reportingManager,
  joiningDate,
  employmentType,
  status,
  profilePhoto,
  createdAt,
  updatedAt
}
```

---

## Departments

```javascript
{
  _id,
  departmentCode,
  departmentName,
  managerId,
  status,
  createdAt,
  updatedAt
}
```

---

## Attendance

```javascript
{
  _id,
  employeeId,
  date,
  clockIn,
  clockOut,
  workingHours,
  overtime,
  status
}
```

---

## Leave Requests

```javascript
{
  _id,
  employeeId,
  leaveType,
  startDate,
  endDate,
  reason,
  status,
  approvedBy
}
```

---

## Payroll

```javascript
{
  _id,
  employeeId,
  month,
  basicSalary,
  hra,
  overtime,
 bonus,
  deductions,
  netSalary
}
```

---

## Projects

```javascript
{
  _id,
  projectName,
  description,
  managerId,
  status,
  startDate,
  endDate
}
```

---

## Tasks

```javascript
{
  _id,
  projectId,
  assignedTo,
  title,
  priority,
  deadline,
  status
}
```

---

## Assets

```javascript
{
  _id,
  assetName,
  assetCode,
  assignedTo,
  purchaseDate,
  status
}
```

---

## Documents

```javascript
{
  _id,
  employeeId,
  fileName,
  fileType,
  storageUrl,
  uploadedBy,
  uploadedAt
}
```

---

## Notifications

```javascript
{
  _id,
  recipientId,
  title,
  message,
 type,
  isRead,
  createdAt
}
```

---

## Audit Logs

```javascript
{
  _id,
  userId,
  action,
  entity,
  entityId,
  ipAddress,
  timestamp
}
```

---

# 18. Engineering Rules

Every database model must:

- Use timestamps
- Validate required fields
- Use indexes where necessary
- Never expose sensitive fields
- Keep business logic outside models
- Use ObjectId references for relationships
- Support future microservice extraction

---

## Database Development Checklist

Before creating a collection:

- Schema defined
- Validation added
- Indexes created
- Relationships documented
- CRUD APIs planned
- RBAC considered
- Audit logging enabled
- Test data prepared

---

## End of Document

**Next Document:** `05_FRONTEND_ENGINEERING.md`

This document will define the complete React architecture, folder structure, routing strategy, dashboard layouts, reusable component standards, state management, UI conventions, TailwindCSS guidelines, and frontend development rules.