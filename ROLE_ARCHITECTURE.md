# Rol Sistemi Mimarisi

## Sistem Akışı

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Frontend)                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Authentication Service (Port 8080)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │  Public Routes   │         │  JWT Validation  │              │
│  ├──────────────────┤         ├──────────────────┤              │
│  │ POST /auth/login │         │ Validate Token   │              │
│  │ POST /auth/reg.. │         │ Extract Claims   │              │
│  │ GET /health      │         │ Get User Role    │              │
│  └──────────────────┘         └──────────────────┘              │
│                                        │                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Protected Routes                               │   │
│  │           (JWT Required)                                 │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  GET /users              → UserHandler.GetAll()          │   │
│  │  GET /users/:id          → UserHandler.GetByID()         │   │
│  │  PUT /users/:id          → UserHandler.Update()          │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │ Admin Middleware Check                            │ │   │
│  │  │ if role !== "admin" → 403 Forbidden              │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │         │                                              │   │
│  │         ▼                                              │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │      Admin-Only Routes                           │ │   │
│  │  ├────────────────────────────────────────────────────┤ │   │
│  │  │  POST /admin/users                               │ │   │
│  │  │  DELETE /admin/users/:id   (Soft Delete)        │ │   │
│  │  │  PUT /admin/users/:id/role (Change Role)        │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐ ┌──────────────┐   │
│  │  Auth Service    │  │  User Service    │ │  Repository  │   │
│  ├──────────────────┤  ├──────────────────┤ ├──────────────┤   │
│  │ Login()          │  │ Get()            │ │ GetByID()    │   │
│  │ Register()       │  │ GetAll()         │ │ GetByEmail() │   │
│  │ generateToken()  │  │ Create()         │ │ GetAll()     │   │
│  │ (JWT + role)     │  │ Update()         │ │ Create()     │   │
│  │                  │  │ Delete()         │ │ Update()     │   │
│  │                  │  │ (soft delete)    │ │ Delete()     │   │
│  │                  │  │                  │ │ SeedUsers()  │   │
│  └──────────────────┘  └──────────────────┘ └──────────────┘   │
│                                │                                 │
│                                ▼                                 │
│                    ┌──────────────────────┐                     │
│                    │  MongoDB Database    │                     │
│                    │  "users" Collection  │                     │
│                    └──────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

## JWT Token İçeriği

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Claims):
{
  "user_id": "ObjectID",
  "email": "user@example.com",
  "role": "admin" | "user",      ← YENİ
  "exp": 1735318400
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## User Model

```
User Document (MongoDB):
{
  "_id": ObjectId("..."),
  "email": "admin@example.com",
  "first_name": "Admin",
  "last_name": "User",
  "password": "hashed_password",
  "role": "admin",              ← YENİ
  "active": true,
  "deleted_at": null,           ← YENİ (Soft Delete)
  "addresses": [
    {
      "title": "Office",
      "city": "Istanbul",
      "district": "Kadikoy",
      "full_address": "..."
    }
  ],
  "created_at": ISODate("..."),
  "updated_at": ISODate("...")
}
```

## Middleware Stack

```
Request Flow:
┌──────────────────┐
│  HTTP Request    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  CORS Middleware                 │
│  (Allow cross-origin requests)   │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Logger Middleware               │
│  (Log all requests)              │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Recover Middleware              │
│  (Panic recovery)                │
└────────┬─────────────────────────┘
         │
         ▼ (Only for protected routes)
┌──────────────────────────────────┐
│  JWT Middleware                  │
│  - Extract token from header     │
│  - Validate signature            │
│  - Extract claims                │
│  - Set "user" in context         │
└────────┬─────────────────────────┘
         │
         ▼ (Only for admin routes)
┌──────────────────────────────────┐
│  Admin Middleware                │
│  - Get role from claims          │
│  - Check if role === "admin"     │
│  - Return 403 if not admin       │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Handler         │
│  (Controller)    │
└──────────────────┘
```

## Access Control Matrix

```
┌─────────────────────┬──────────────┬──────────────┐
│ Endpoint            │ Normal User  │ Admin        │
├─────────────────────┼──────────────┼──────────────┤
│ GET /users          │ Active only  │ All (inc.    │
│                     │              │ deleted)     │
├─────────────────────┼──────────────┼──────────────┤
│ GET /users/:id      │ ✓            │ ✓            │
├─────────────────────┼──────────────┼──────────────┤
│ PUT /users/:id      │ ✓ (self)     │ ✓ (any)      │
├─────────────────────┼──────────────┼──────────────┤
│ POST /admin/users   │ ✗            │ ✓            │
├─────────────────────┼──────────────┼──────────────┤
│ DELETE /admin/:id   │ ✗            │ ✓ (Soft Del.)│
├─────────────────────┼──────────────┼──────────────┤
│ PUT /admin/:id/role │ ✗            │ ✓            │
└─────────────────────┴──────────────┴──────────────┘

Legend:
✓ = Allowed
✗ = Forbidden (403)
(self) = Only own profile
(inc. deleted) = Including soft-deleted users
(Soft Del.) = Mark as deleted, don't hard delete
```

## Request/Response Cycle Examples

### Example 1: Normal User Login
```
1. Client
   POST /auth/login
   { "email": "user@example.com", "password": "password" }
   
2. Auth Handler
   ✓ Validate credentials
   ✓ Generate JWT token (includes role="user")
   
3. Response
   {
     "token": "eyJhbGc...",
     "user": { "role": "user", ... }
   }

4. Client stores token in localStorage
```

### Example 2: Admin Changes User Role
```
1. Client
   PUT /admin/users/{id}/role
   Authorization: Bearer {admin_token}
   { "role": "admin" }

2. Router
   ✓ Routes to /admin/users group
   
3. JWT Middleware
   ✓ Extracts token
   ✓ Validates signature
   ✓ Extracts claims (role="admin")
   ✓ Sets context["user"] = token
   
4. Admin Middleware
   ✓ Gets role from claims
   ✓ Checks if role === "admin"
   ✓ Allows request to proceed
   
5. Handler
   ✓ Gets user from repo
   ✓ Updates role field
   ✓ Calls service.Update()
   
6. Service
   ✓ Validates data
   ✓ Calls repo.Update()
   
7. Repository
   ✓ Updates MongoDB document
   ✓ Sets updated_at field
   
8. Response
   { "message": "role updated" }
```

### Example 3: Soft Delete User
```
1. Admin requests
   DELETE /admin/users/{id}
   Authorization: Bearer {admin_token}

2. Handler
   ✓ Gets user from repo
   ✓ Calls service.Delete()

3. Service
   ✓ Calls repo.Delete()

4. Repository
   UPDATE users SET deleted_at = NOW(), active = false WHERE _id = {id}
   NOTE: Addresses array is NOT deleted!

5. Database State After
   {
     "email": "...",
     "deleted_at": ISODate("2025-12-27T..."),
     "active": false,
     "addresses": [ ... ] ← Still there!
   }

6. Next GetAll() call
   - If requester is admin: Includes this user
   - If requester is normal user: Excludes this user (deleted_at != null)
```

---

## Önemli Detaylar

### 1. Role Claim JWT'de Saklanır
- Frontend token'dan role'ü okuyarak UI'ı güncelleyebilir
- Tüm requests'lerde middleware tarafından doğrulanır

### 2. Soft Delete Adresleri Korur
- Sadece `deleted_at` ve `active` güncellenir
- Kullanıcı bilgileri kalıcı olarak silinmez
- Admin'ler silinmiş users'ları görebilir

### 3. Rol-Based Access Control
- GetAll() handler'ında dinamik filtreleme
- Admin'ler tüm users'ları görür
- Normal users sadece aktif users'ları görür

### 4. Middleware Güvenliği
- Admin middleware role'ü her request'te doğrular
- JWT token'daki role değeri merkezi kaynaktır
- Token validity + role kontrolü çift koruma

---

**Tarih**: 27 Aralık 2025
