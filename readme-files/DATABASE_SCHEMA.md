# Database Schema & Soft Delete Örneği

## MongoDB Users Collection Schema

```javascript
// users collection

{
  // Sistem Alanları
  "_id": ObjectId("..."),
  "created_at": ISODate("2025-12-27T10:00:00Z"),
  "updated_at": ISODate("2025-12-27T10:30:00Z"),
  
  // Authentication
  "email": string (unique),
  "password": string (bcrypt hashed),
  
  // User Profili
  "first_name": string,
  "last_name": string,
  "role": "admin" | "user",           // YENİ
  
  // Status
  "active": boolean,
  "deleted_at": ISODate | null,       // YENİ - Soft Delete
  
  // İlişki
  "addresses": [
    {
      "title": string,
      "city": string,
      "district": string,
      "full_address": string
    },
    ...
  ]
}
```

---

## Örnek Veriler

### Admin User (Active)
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "admin@example.com",
  "password": "$2a$10$...(bcrypt hashed)...",
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin",
  "active": true,
  "deleted_at": null,
  "addresses": [
    {
      "title": "Office",
      "city": "Istanbul",
      "district": "Kadikoy",
      "full_address": "Kanuni Kampüsü, Istanbul"
    }
  ],
  "created_at": ISODate("2025-12-27T09:00:00Z"),
  "updated_at": ISODate("2025-12-27T09:00:00Z")
}
```

### Normal User (Active)
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "email": "user@example.com",
  "password": "$2a$10$...(bcrypt hashed)...",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "active": true,
  "deleted_at": null,
  "addresses": [
    {
      "title": "Home",
      "city": "Istanbul",
      "district": "Besiktas",
      "full_address": "Main Street 123"
    }
  ],
  "created_at": ISODate("2025-12-27T09:15:00Z"),
  "updated_at": ISODate("2025-12-27T09:15:00Z")
}
```

### Soft Deleted User
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "email": "deleted@example.com",
  "password": "$2a$10$...",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "user",
  "active": false,                    // ← PASIF
  "deleted_at": ISODate("2025-12-27T15:30:00Z"),  // ← SOFT DELETE TARİHİ
  "addresses": [                      // ← KORUNDU!
    {
      "title": "Previous Address",
      "city": "Istanbul",
      "district": "Sisli",
      "full_address": "Some Street 456"
    }
  ],
  "created_at": ISODate("2025-12-26T10:00:00Z"),
  "updated_at": ISODate("2025-12-27T15:30:00Z")  // ← GÜNCELLEME TARİHİ
}
```

---

## Collection Indexes

```javascript
// Recommended Indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "deleted_at": 1 })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "active": 1 })

// Compound Indexes
db.users.createIndex({ 
  "deleted_at": 1, 
  "active": 1 
})
```

---

## Query Örnekleri

### 1. Tüm Aktif Users'ları Getir
```javascript
db.users.find({
  "deleted_at": null,
  "active": true
})

// Index: { "deleted_at": 1, "active": 1 }
```

### 2. Sadece Admin'leri Getir
```javascript
db.users.find({
  "role": "admin",
  "deleted_at": null
})

// Index: { "role": 1, "deleted_at": 1 }
```

### 3. Email ile User Bul
```javascript
db.users.findOne({
  "email": "user@example.com"
})

// Index: { "email": 1 } (unique)
```

### 4. Soft Deleted Users Bul
```javascript
db.users.find({
  "deleted_at": { $ne: null }
})
```

### 5. Admin View - Tüm Users
```javascript
db.users.find({
  "deleted_at": null
})
```

### 6. Recovery - Deleted User Restore
```javascript
db.users.updateOne(
  { "_id": ObjectId("...") },
  {
    $set: {
      "deleted_at": null,
      "active": true,
      "updated_at": new Date()
    }
  }
)
```

---

## State Transitions

### Normal User Yaşam Döngüsü

```
┌─────────────────┐
│   REGISTRATION  │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │ ACTIVE  │ (active=true, deleted_at=null)
    └────┬────┘
         │
         ├─ role change →  ROLE CHANGED
         │
         ├─ inactivate →   INACTIVE (active=false, deleted_at=null)
         │
         └─ delete →       ┌──────────────────┐
                           │  SOFT DELETED    │
                           │ (active=false,   │
                           │  deleted_at=now) │
                           └──────────────────┘
                                  │
                                  └─ restore → ACTIVE
```

---

## API → Database Mapping

### POST /auth/register
```
Request:
{
  "email": "new@example.com",
  "password": "password",
  "first_name": "New",
  "last_name": "User",
  "addresses": [...]
}

Database:
INSERT users {
  _id: ObjectId(),
  email: "new@example.com",
  password: bcrypt("password"),
  first_name: "New",
  last_name: "User",
  role: "user",           ← Default
  active: true,           ← Default
  deleted_at: null,       ← Default
  addresses: [...],
  created_at: now(),
  updated_at: now()
}
```

### POST /auth/login
```
Request:
{
  "email": "admin@example.com",
  "password": "password"
}

Database Query:
SELECT * FROM users
WHERE email = "admin@example.com"
  AND deleted_at IS NULL

Validate:
- password match
- active = true

Response:
- JWT token (includes role)
- user object
```

### PUT /admin/users/:id/role
```
Request:
{
  "role": "admin"
}

Database:
UPDATE users
SET role = "admin",
    updated_at = now()
WHERE _id = ObjectId(":id")
  AND deleted_at IS NULL
```

### DELETE /admin/users/:id
```
Database:
UPDATE users
SET deleted_at = now(),
    active = false,
    updated_at = now()
WHERE _id = ObjectId(":id")

NOTE: addresses array is NOT modified
```

### GET /users (Admin)
```
Database Query:
SELECT * FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC

Result: All active and inactive users (but not deleted)
```

### GET /users (Normal User)
```
Database Query:
SELECT * FROM users
WHERE deleted_at IS NULL
  AND active = true
ORDER BY created_at DESC

Result: Only active users
```

---

## Performance Considerations

### Index Strategy
```
Primary Queries:
1. findOne by email (unique)
2. find by (deleted_at + active)
3. find by role
4. find by created_at (pagination)

Recommended Indexes:
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "deleted_at": 1, "active": 1 })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "created_at": -1 })
```

### Query Optimization
```
Bad (Full collection scan):
db.users.find({ "first_name": "John" })

Good (Use indexed field):
db.users.find({ 
  "email": "john@example.com",
  "deleted_at": null 
})
```

---

## Soft Delete vs Hard Delete

### Soft Delete (Current Implementation)
| Aspect | Soft | Hard |
|--------|------|------|
| Veri Kaybı | ❌ | ✓ |
| Restore | ✓ | ❌ |
| Audit Trail | ✓ | ❌ |
| Space Usage | Slightly Higher | Lower |
| Query Complexity | Slightly Higher | Lower |
| Recovery | Easy | Impossible |

---

## Veri Bütünlüğü

### Constraints
- Email unique (no duplicates)
- Deleted users still have deleted_at timestamp
- Addresses never deleted (preserved for audit)
- Password always hashed (never stored plaintext)

### Referential Integrity
```javascript
// If other collections reference users:
// - waste-service.wastes.user_id → users._id
// - other-service.xxx.user_id → users._id

// These become "orphaned" if user is deleted
// Consider cascading or soft updates
```

---

## Backup & Recovery

### Export Users
```bash
mongoexport --db authentication --collection users \
  -o users_backup.json
```

### Import Users
```bash
mongoimport --db authentication --collection users \
  --file users_backup.json
```

### Restore Soft Deleted User
```javascript
db.users.updateOne(
  { "_id": ObjectId("...") },
  {
    $set: {
      "deleted_at": null,
      "active": true,
      "updated_at": new Date()
    }
  }
)
```

---

**Tarih**: 27 Aralık 2025  
**MongoDB Version**: 5.0+  
**Schema Version**: 2.0 (Soft Delete Support)
