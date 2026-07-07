# Enterprise Workforce Management Platform with AI Operations Assistant

> Version: 1.0
> Document Type: Backend Engineering Handbook
> Stack: Node.js + Express.js + MongoDB
> Architecture: Modular Monolith (Microservice Ready)

---

# Table of Contents

1. Purpose
2. Backend Philosophy
3. Backend Folder Structure
4. Layered Architecture
5. Module Organization
6. Request Lifecycle
7. Coding Standards
8. Controller Guidelines
9. Service Guidelines
10. Repository Layer
11. Middleware
12. Authentication Flow
13. RBAC
14. API Standards
15. Validation
16. Error Handling
17. Logging
18. Environment Variables
19. Response Standards
20. Security Standards
21. Development Rules

---

# 1. Purpose

This document defines how every backend feature of the Enterprise Workforce Management Platform must be implemented.

It acts as the engineering handbook for developers and AI coding assistants.

All backend code must follow this document.

---

# 2. Backend Philosophy

The backend should be:

- Modular
- Scalable
- Secure
- Maintainable
- Testable
- Reusable

Business logic must never be tightly coupled with routes or controllers.

Every module should be independently maintainable.

---

# 3. Backend Folder Structure

```
backend/

src/

config/

database/

controllers/

services/

repositories/

models/

routes/

middlewares/

validators/

utils/

constants/

helpers/

types/

docs/

tests/

server.js
```

---

## Folder Responsibilities

### config/

Contains

- Environment Loader
- JWT Configuration
- Database Config
- Mail Configuration
- Cloudinary Config

---

### controllers/

Responsibilities

- Receive request
- Call service
- Return response

Controllers should never contain business logic.

---

### services/

Responsibilities

- Business Rules
- Processing
- Calculations
- Workflow

Every module must have its own service.

Example

```
employee.service.js

attendance.service.js

payroll.service.js
```

---

### repositories/

Responsibilities

Only interact with MongoDB.

Allowed:

- find()
- create()
- update()
- aggregate()

Not Allowed:

Business logic

Validation

Authentication

---

### models/

Contains all Mongoose schemas.

Example

```
User.js

Employee.js

Attendance.js

Leave.js

Payroll.js

Candidate.js
```

---

### routes/

Contains Express Routes only.

Example

```
router.post("/login",login)

router.get("/employees",getEmployees)
```

No business logic.

---

### middlewares/

Contains

- Authentication
- Authorization
- Validation
- Error Handling
- Logging
- Rate Limiting

---

### validators/

Contains request validation using Joi/Zod/Express Validator.

Example

```
login.validator.js

employee.validator.js
```

---

### utils/

Reusable helper functions.

Example

```
jwt.js

password.js

email.js

response.js

pagination.js
```

---

# 4. Layered Architecture

```
Client

↓

Route

↓

Validation Middleware

↓

Authentication Middleware

↓

Role Middleware

↓

Controller

↓

Service

↓

Repository

↓

MongoDB
```

Every request follows this flow.

---

# 5. Module Organization

Every business module follows the same structure.

Example

```
employee/

controller/

service/

repository/

routes/

validator/

model/
```

This consistency allows AI tools to generate new modules easily.

---

# 6. Request Lifecycle

Example

```
POST /employees

↓

Route

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Employee Service

↓

Employee Repository

↓

MongoDB

↓

Response
```

---

# 7. Coding Standards

Naming

Variables

camelCase

Functions

camelCase

Classes

PascalCase

Files

kebab-case

Constants

UPPER_SNAKE_CASE

Folders

lowercase

---

# 8. Controller Guidelines

Controllers should:

✔ Receive request

✔ Validate input

✔ Call Service

✔ Return response

Controllers should NOT

❌ Access database directly

❌ Perform calculations

❌ Hash passwords

❌ Generate JWT

---

Example

```javascript
export const login = async(req,res)=>{

const response = await authService.login(req.body);

return success(res,response);

}
```

---

# 9. Service Guidelines

Business logic belongs here.

Example

```
Create Employee

Generate Employee ID

Hash Password

Assign Department

Generate JWT

Send Email
```

Services may call multiple repositories.

---

# 10. Repository Layer

Repositories communicate with MongoDB.

Example

```
EmployeeRepository

create()

findById()

findAll()

update()

archive()

search()
```

Repositories never return HTTP responses.

---

# 11. Middleware

Global Middleware

- Helmet
- CORS
- Morgan
- JSON Parser

Authentication Middleware

Checks JWT.

Authorization Middleware

Checks Roles.

Validation Middleware

Checks request payload.

Error Middleware

Formats all errors consistently.

---

# 12. Authentication Flow

```
Login Request

↓

Validate Credentials

↓

Verify Password

↓

Generate JWT

↓

Generate Refresh Token

↓

Store Session

↓

Return Tokens
```

---

# 13. RBAC

Roles

- SUPER_ADMIN
- ORG_ADMIN
- HR_MANAGER
- MANAGER
- TEAM_LEAD
- EMPLOYEE
- FINANCE
- IT_ADMIN
- AUDITOR

Middleware Example

```javascript
authorize(["HR_MANAGER","SUPER_ADMIN"])
```

---

# 14. API Standards

Endpoints

```
/api/auth

/api/employees

/api/attendance

/api/payroll

/api/projects
```

HTTP Methods

GET

POST

PUT

PATCH

DELETE

---

# 15. Validation

Every request must be validated.

Example

Employee

```
name

email

department

joiningDate

salary
```

Reject invalid data before reaching services.

---

# 16. Error Handling

Never expose internal errors.

Format

```json
{
 "success":false,
 "message":"Employee not found",
 "errorCode":"EMPLOYEE_NOT_FOUND"
}
```

---

# 17. Logging

Every request logs

- User
- Endpoint
- Method
- Status
- Response Time
- Timestamp

Use:

- Morgan
- Winston

Future

Grafana

Prometheus

---

# 18. Environment Variables

Example

```
PORT=

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

SMTP_HOST=

SMTP_USER=

SMTP_PASS=

OPENAI_API_KEY=

CLOUDINARY_NAME=

CLOUDINARY_KEY=

CLOUDINARY_SECRET=
```

Never hardcode secrets.

---

# 19. API Response Standards

Success

```json
{
 "success":true,
 "message":"Employee created successfully",
 "data":{}
}
```

Failure

```json
{
 "success":false,
 "message":"Validation failed",
 "errors":[]
}
```

Pagination

```json
{
 "success":true,
 "page":1,
 "limit":10,
 "total":120,
 "data":[]
}
```

---

# 20. Security Standards

Mandatory

- JWT Authentication
- Refresh Tokens
- bcrypt Password Hashing
- Helmet
- CORS
- Rate Limiting
- Request Validation
- Account Lock after failed attempts
- Password Complexity
- Audit Logs

Never

❌ Store plain text passwords

❌ Expose stack traces

❌ Trust client-side validation

❌ Skip authorization checks

---

# 21. Development Rules

Every backend feature must:

- Follow the folder structure.
- Use the Controller → Service → Repository pattern.
- Keep business logic inside services.
- Use async/await.
- Return standardized responses.
- Validate every request.
- Log important events.
- Respect RBAC.
- Be documented before implementation.
- Be modular enough to become a microservice in the future.

---

## Backend Development Checklist

Before merging any feature:

- Authentication implemented
- Authorization verified
- Validation added
- Business logic in service
- Repository implemented
- Error handling completed
- Logs added
- Environment variables used
- API documented
- Tested successfully

---

## End of Document

**Next Document:** `04_DATABASE_AND_AUTHENTICATION.md`

This document will define the complete MongoDB schema, collection relationships, indexes, authentication lifecycle, JWT strategy, refresh tokens, employee onboarding flow, RBAC matrix, and security implementation.