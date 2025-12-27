# API Endpoint Referansı

## Authentication Service (Port: 8080)

### Public Endpoints

#### 1. Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "admin@example.com",
  "password": "password"
}

Response (200):
{
  "message": "login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin",
    "active": true,
    "addresses": [...]
  }
}
```

#### 2. Register
```
POST /auth/register
Content-Type: application/json

Request:
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "addresses": [
    {
      "title": "Home",
      "city": "Istanbul",
      "district": "Besiktas",
      "full_address": "Test Address 123"
    }
  ]
}

Response (201):
{
  "message": "user created"
}
```

#### 3. Health Check
```
GET /health

Response (200):
{
  "status": "ok"
}
```

#### 4. Validate Token
```
GET /auth/validate
Authorization: Bearer {token}

Response (200):
{
  "valid": true,
  "user_id": "..."
}
```

---

## Protected Endpoints (JWT Required)

### User Listing & Details

#### 5. List All Users (Role-Based)
```
GET /users
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "...",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "active": true,
    "deleted_at": null,
    "addresses": [...]
  },
  ...
]

Notes:
- Admin token: Tüm users (aktif/pasif/silinmiş)
- User token: Sadece aktif users
```

#### 6. Get User Details
```
GET /users/:id
Authorization: Bearer {token}

Response (200):
{
  "id": "...",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "active": true,
  "deleted_at": null,
  "addresses": [...]
}
```

#### 7. Update Profile
```
PUT /users/:id
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "newemail@example.com",
  "active": true,
  "role": "user",
  "addresses": [
    {
      "title": "Home",
      "city": "Istanbul",
      "district": "Besiktas",
      "full_address": "New Address"
    }
  ]
}

Response (200):
{
  "message": "user updated"
}
```

---

## Admin-Only Endpoints (JWT + Admin Middleware Required)

#### 8. Create New User (Admin)
```
POST /admin/users
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
  "email": "newadmin@example.com",
  "password": "securepassword",
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin",
  "addresses": [
    {
      "title": "Office",
      "city": "Istanbul",
      "district": "Kadikoy",
      "full_address": "Admin Office Address"
    }
  ]
}

Response (201):
{
  "id": "...",
  "email": "newadmin@example.com",
  ...
}
```

#### 9. Delete User (Soft Delete)
```
DELETE /admin/users/:id
Authorization: Bearer {admin_token}

Response (200):
{
  "message": "user deleted"
}

Result:
- User's deleted_at alanı set edilir
- User's active alanı false olur
- Addresses korunur
- Database'de document silinmez
```

#### 10. Change User Role
```
PUT /admin/users/:id/role
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
  "role": "admin"
}

Valid Values: "admin" | "user"

Response (200):
{
  "message": "role updated"
}

Example Scenarios:
- User → Admin: Kullanıcıyı admin yapma
- Admin → User: Admin'i kullanıcıya indirgeme
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid payload"
}
```

### 401 Unauthorized
```json
{
  "error": "invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "admin role required"
}
```

### 404 Not Found
```json
{
  "error": "user not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "error message"
}
```

---

## Demo Credentials

```
Admin Account:
Email: admin@example.com
Password: password
Role: admin

User Account:
Email: user@example.com
Password: password
Role: user
```

---

## Testing Examples

### 1. Admin Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

### 2. List All Users as Admin
```bash
ADMIN_TOKEN="eyJhbGc..." # Login'den dönen token

curl -X GET http://localhost:8080/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 3. Change User Role
```bash
curl -X PUT http://localhost:8080/admin/users/{user_id}/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### 4. Soft Delete User
```bash
curl -X DELETE http://localhost:8080/admin/users/{user_id} \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

**Last Updated**: 27 December 2025
