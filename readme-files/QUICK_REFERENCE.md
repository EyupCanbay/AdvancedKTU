# Hızlı Referans Rehberi

## 🎯 Rol Sistemi Özet

### İki Rol Türü:
- **admin**: Tüm sistem erişimi, user yönetimi, rol değiştirme
- **user**: Sınırlı erişim, sadece aktif users'ları görebilir

---

## 🔑 Temel Komutlar

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

### Token Kullan
```bash
TOKEN="eyJhbGc..."
curl http://localhost:8080/users \
  -H "Authorization: Bearer $TOKEN"
```

### Rol Değiştir (Admin Only)
```bash
curl -X PUT http://localhost:8080/admin/users/USER_ID/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

### User Sil (Soft Delete)
```bash
curl -X DELETE http://localhost:8080/admin/users/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🗂️ Dosya Yapısı

```
authentication-service/
├── internal/
│   ├── domain/
│   │   └── user.go              ← Model (role, deletedAt)
│   ├── repository/
│   │   └── repository.go        ← Soft delete logic
│   ├── service/
│   │   ├── auth_service.go      ← JWT + role
│   │   └── user_service.go      ← Business logic
│   └── handler/
│       ├── http/
│       │   ├── auth_handler.go
│       │   └── user_handler.go  ← Role-based filtering
│       └── middleware/
│           ├── jwt_middleware.go
│           └── admin_middleware.go ← YENİ
└── cmd/api/
    └── main.go                  ← Routes with middleware
```

---

## 🛡️ Middleware Stack

```
Request Flow:
CORS → Logger → Recover → [JWT] → [Admin] → Handler

Köşeli parantez = Optional (nur protected routes)
```

---

## 📊 Rol-Based Access

| Endpoint | Public | JWT | Admin |
|----------|--------|-----|-------|
| POST /auth/login | ✓ | - | - |
| POST /auth/register | ✓ | - | - |
| GET /health | ✓ | - | - |
| GET /users | - | ✓ | ✓ |
| GET /users/:id | - | ✓ | ✓ |
| PUT /users/:id | - | ✓ | ✓ |
| POST /admin/users | - | - | ✓ |
| DELETE /admin/users/:id | - | - | ✓ |
| PUT /admin/users/:id/role | - | - | ✓ |

**Gösterim:**
- ✓ = Allowed
- - = Forbidden

---

## 🔐 JWT Token

```json
{
  "user_id": "ObjectID",
  "email": "user@example.com",
  "role": "admin|user",
  "exp": timestamp
}
```

---

## 📝 Database Query

### Tüm Active Users
```javascript
db.users.find({
  "deleted_at": null,
  "active": true
})
```

### Tüm Users (Admin View)
```javascript
db.users.find({
  "deleted_at": null
})
```

### Silinmiş Users
```javascript
db.users.find({
  "deleted_at": { $ne: null }
})
```

---

## 🐛 Debugging

### Token Decode
```bash
# Online kullanabilirsiniz: https://jwt.io
# Paste token'ı ve secret'i girin
```

### Middleware Kontrol
```bash
# JWT Middleware sorunu
curl -H "Authorization: Bearer invalid" http://localhost:8080/users

# Admin Middleware sorunu
curl -H "Authorization: Bearer user_token" http://localhost:8080/admin/users
```

### Database Kontrol
```bash
# MongoDB bağlantısı
mongosh "mongodb://admin:password123@localhost:27017/authentication"

# Users collection
db.users.find().pretty()
```

---

## 📋 Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | admin |
| user@example.com | password | user |

---

## ⚡ Hata Kodları

| Code | Anlamı | Çözüm |
|------|--------|-------|
| 400 | Bad Request | Request body'yi kontrol et |
| 401 | Unauthorized | Token geçersiz/missing |
| 403 | Forbidden | Admin rolü gerekli |
| 404 | Not Found | User/Resource bulunamadı |
| 500 | Server Error | Logs'ları kontrol et |

---

## 🚀 Deployment Notes

### Environment Variables
```bash
MONGO_URI="mongodb://admin:password123@localhost:27017"
DB_NAME="authentication"
JWT_SECRET="your-secret-key"
PORT="8080"
```

### Production Changes
```go
// CORS
AllowOrigins: []string{"https://yourdomain.com"}

// JWT expiry
time.Hour * 24  // Shorter in production

// Database
Enable authentication
Use connection pooling
Set timeouts
```

---

## 📚 Documention Files

1. **IMPLEMENTATION_SUMMARY.md** - This file
2. **ROLE_SYSTEM_CHANGES.md** - Detailed changes
3. **API_ENDPOINTS.md** - All API endpoints
4. **ROLE_ARCHITECTURE.md** - System architecture

---

## ✅ Checklist

- [x] Role model field added
- [x] DeletedAt field added (soft delete)
- [x] JWT middleware (existing)
- [x] Admin middleware (new)
- [x] Role in JWT token
- [x] GetAll() role-based filtering
- [x] Admin-only endpoints
- [x] ChangeRole endpoint
- [x] Soft delete preserves addresses
- [x] Demo data with roles
- [x] Build successful

---

## 🎓 Öğrenme Kaynakları

### Go Best Practices
- Middleware pattern
- Dependency injection
- Error handling

### JWT
- Token structure
- Claims
- Signature verification

### MongoDB
- Soft delete pattern
- Query filtering
- Document update

### REST API
- HTTP methods (POST, GET, PUT, DELETE)
- Status codes
- Error responses

---

**Son Güncelleme**: 27 Aralık 2025  
**Status**: Production Ready ✅
