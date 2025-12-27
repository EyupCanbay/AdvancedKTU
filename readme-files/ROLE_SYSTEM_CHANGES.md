# Rol Sistemi ve Soft Delete Implementasyonu

Bu dokument, authentication-service'e eklenen rol sistemi, auth middleware, ve soft delete özelliklerini açıklamaktadır.

## 1. Model Değişiklikleri

### User Model (user.go)
```go
type User struct {
    ID        primitive.ObjectID
    Email     string
    FirstName string
    LastName  string
    Password  string
    Addresses []Address
    Role      string       // YENİ: "admin" veya "user"
    Active    bool
    DeletedAt *time.Time   // YENİ: Soft delete için
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

**Roller:**
- `admin`: Admin hesaplar tüm verileri görebilir, user yönetimi yapabilir, rol değiştirebilir
- `user`: Normal kullanıcı, sadece aktif kullanıcıları görebilir

## 2. Repository Değişiklikleri

### Soft Delete (repository.go)
`Delete()` methodu artık hard delete yerine soft delete yapıyor:
```go
// Hard delete yerine:
deleted_at alanını güncelle
active alanını false yap
adresleri KORUR
```

### GetAll() Filtresi
Sadece `deleted_at == nil` olan kullanıcıları döner.

### Seed Data
Demo users:
- `admin@example.com` / `password` → **admin** rolü
- `user@example.com` / `password` → **user** rolü

## 3. Middleware

### JWT Middleware (jwt_middleware.go - Mevcut)
Tüm korumalı endpoint'lere JWT token zorunluluğu ekler.

### Admin Middleware (admin_middleware.go - YENİ)
JWT token'dan role'ü çıkartır ve sadece admin'e izin verir:
```go
func AdminMiddleware(next echo.HandlerFunc) echo.HandlerFunc
```

## 4. Service Değişiklikleri

### Auth Service (auth_service.go)
- `generateToken()`: JWT token'a `role` claim'i ekleniyor
- Register: Yeni users otomatik olarak "user" rolü alıyor

### User Service (user_service.go)
- `Create()`: Yeni users'lar "user" rolü ile oluşturuluyor
- `Update()`: Role güncellenmesi destekleniyor

## 5. Handler Değişiklikleri

### User Handler (user_handler.go)

#### GetAll() - Rol-Based Filtering
```
Normal users → sadece aktif kullanıcıları görebilir
Admin users → tüm kullanıcıları görebilir (aktif/pasif)
```

#### ChangeRole() - YENİ
```
PUT /admin/users/:id/role
{
  "role": "admin" | "user"
}
```
Sadece admin'lerin erişebileceği bir endpoint.

## 6. Route Yapısı (main.go)

### Public Routes
- `POST /auth/login`
- `POST /auth/register`
- `GET /health`
- `GET /auth/validate` (JWT gerekli)

### Protected Routes (JWT Gerekli)
```
GET    /users          → Tüm kullanıcıları listele (role-based filter)
GET    /users/:id      → Kullanıcı detayı
PUT    /users/:id      → Kendi profilini güncelle
```

### Admin-Only Routes (JWT + Admin Middleware Gerekli)
```
POST   /admin/users              → Yeni user ekle
DELETE /admin/users/:id          → User soft delete (pasif yap)
PUT    /admin/users/:id/role     → User rolü değiştir
```

## 7. Workflow Örnekleri

### Login & Token
```bash
POST /auth/login
{
  "email": "admin@example.com",
  "password": "password"
}

Dönen token içerir:
{
  "user_id": "...",
  "email": "admin@example.com",
  "role": "admin",
  "exp": ...
}
```

### Rol Değiştirme
```bash
PUT /admin/users/:id/role
Authorization: Bearer {admin_token}
{
  "role": "admin"
}
```

### Soft Delete (Pasif Yap)
```bash
DELETE /admin/users/:id
Authorization: Bearer {admin_token}

Sonuç:
- deleted_at = şu anki zaman
- active = false
- Adresleri KORUNUR
```

### Tüm Kullanıcıları Listele
```bash
GET /users
Authorization: Bearer {token}

Admin token'ı ile → tüm users (aktif/pasif)
User token'ı ile → sadece aktif users
```

## 8. Veritabanı Değişiklikleri

Mevcut users collection'ı otomatik olarak yeni alanlarla güncellenir:

```javascript
{
  "_id": ObjectId("..."),
  "email": "admin@example.com",
  "first_name": "Admin",
  "last_name": "User",
  "password": "hashed_password",
  "role": "admin",              // YENİ
  "active": true,
  "deleted_at": null,           // YENİ
  "addresses": [...],
  "created_at": ISODate("..."),
  "updated_at": ISODate("...")
}
```

## 9. Önemli Notlar

1. **Soft Delete**: `DeletedAt` alanı set edilir ama document silinmez
2. **Adres Korunur**: Soft delete yaparken adresleri silmiyoruz, sadece pasif yapıyoruz
3. **Admin Ayrıcalığı**: Admin'ler deleted_at === null olmayan users'ları da görebilirler
4. **Default Rol**: Yeni register yapan users otomatik "user" rolü alır
5. **Token Doğrulama**: Tüm protected routes JWT token gerektirir

## 10. Güvenlik

- JWT middleware tüm protected routes'ları korur
- Admin middleware sadece admin role'üne sahip olanları geçirir
- Role claim JWT token'ında saklandığından, frontend'de de kullanılabilir
- Passwords bcrypt ile hash'lenir

---

**Son Güncelleme**: 27 Aralık 2025
