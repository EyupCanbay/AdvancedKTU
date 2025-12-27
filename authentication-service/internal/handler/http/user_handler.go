package http

import (
	"authentication-service/internal/domain"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	service domain.UserService
}

func NewUserHandler(service domain.UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
}

func (h *UserHandler) RegisterRoutes(e *echo.Echo) {
	// Rotalar main.go'da group ile yönetiliyor
}

// GetAll godoc
// @Summary Tüm Kullanıcıları Getir
// @Description Veritabanındaki tüm kullanıcıları adresleriyle birlikte listeler.
// Admin kullanıcılar aktif/pasif tüm kullanıcıları görebilir.
// Normal kullanıcılar sadece aktif kullanıcıları görebilir.
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} domain.User
// @Failure 500 {object} map[string]string
// @Router /users [get]
func (h *UserHandler) GetAll(c echo.Context) error {
	// JWT token'dan kullanıcı bilgilerini al
	token := c.Get("user")
	var userRole string = "user" // Default

	if token != nil {
		if jwtToken, ok := token.(*jwt.Token); ok {
			if claims, ok := jwtToken.Claims.(jwt.MapClaims); ok {
				if role, ok := claims["role"].(string); ok {
					userRole = role
				}
			}
		}
	}

	users, err := h.service.GetAll(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// Normal user'lar sadece aktif kullanıcıları görebilir
	if userRole != "admin" {
		var activeUsers []*domain.User
		for _, user := range users {
			if user.Active && user.DeletedAt == nil {
				activeUsers = append(activeUsers, user)
			}
		}
		users = activeUsers
	}

	return c.JSON(http.StatusOK, users)
}

// GetByID godoc
// @Summary ID ile Kullanıcı Getir
// @Description Verilen ID'ye sahip kullanıcıyı ve adreslerini döner.
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Success 200 {object} domain.User
// @Failure 404 {object} map[string]string
// @Router /users/{id} [get]
func (h *UserHandler) GetByID(c echo.Context) error {
	id := c.Param("id")
	user, err := h.service.Get(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "user not found"})
	}
	return c.JSON(http.StatusOK, user)
}

// Create godoc
// @Summary Admin Tarafından Kullanıcı Ekle
// @Description Doğrudan bir user objesi oluşturur. Adres listesi zorunludur.
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body domain.User true "User Object (With Addresses)"
// @Success 201 {object} domain.User
// @Failure 400 {object} map[string]string
// @Router /users [post]
func (h *UserHandler) Create(c echo.Context) error {
	var user domain.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
	}

	if err := h.service.Create(c.Request().Context(), &user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, user)
}

// Update godoc
// @Summary Kullanıcı Güncelle
// @Description Mevcut bir kullanıcıyı günceller.
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Param request body domain.User true "Updated User Object"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /users/{id} [put]
func (h *UserHandler) Update(c echo.Context) error {
	id := c.Param("id")
	var user domain.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
	}

	if err := h.service.Update(c.Request().Context(), id, &user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "user updated"})
}

// Delete godoc
// @Summary Kullanıcı Sil (Soft Delete)
// @Description Verilen ID'ye sahip kullanıcıyı soft delete yapar (adresleri korunur).
// @Tags Users
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Success 200 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /admin/users/{id} [delete]
func (h *UserHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := h.service.Delete(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "user deleted"})
}

// ChangeRole godoc
// @Summary Kullanıcı Rolü Değiştir
// @Description Admin tarafından kullanıcının rolü değiştirilebilir.
// @Tags Admin
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Param request body map[string]string true "Role Request {\"role\": \"admin\" or \"user\"}"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Router /admin/users/{id}/role [put]
func (h *UserHandler) ChangeRole(c echo.Context) error {
	id := c.Param("id")
	var req map[string]string
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
	}

	role, ok := req["role"]
	if !ok || (role != "admin" && role != "user") {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid role. must be 'admin' or 'user'"})
	}

	// UserService'den GetAndChangeRole veya UpdateRole metodunu kullan
	// Şimdilik sadece Update çağıracağız ve service'de role'ü değiştireceğiz
	user, err := h.service.Get(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "user not found"})
	}

	user.Role = role
	if err := h.service.Update(c.Request().Context(), id, user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "role updated"})
}
