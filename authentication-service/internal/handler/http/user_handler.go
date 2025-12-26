package http

import (
	"authentication-service/internal/domain"
	"net/http"

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

// RegisterRoutes metodunu main.go içinde manuel yönettiğin için burası sadece referans kalabilir
// Ancak dokümantasyon handler fonksiyonları üzerindeki yorumlardan okunur.
func (h *UserHandler) RegisterRoutes(e *echo.Echo) {
	// Bu kısım main.go içerisinde group ile yönetiliyor
}

// GetAll godoc
// @Summary Tüm Kullanıcıları Getir
// @Description Veritabanındaki tüm kullanıcıları listeler.
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} domain.User
// @Failure 500 {object} map[string]string
// @Router /users [get]
func (h *UserHandler) GetAll(c echo.Context) error {
	users, err := h.service.GetAll(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, users)
}

// GetByID godoc
// @Summary ID ile Kullanıcı Getir
// @Description Verilen ID'ye sahip kullanıcıyı döner.
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
// @Description Doğrudan bir user objesi oluşturur.
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body domain.User true "User Object"
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
// @Summary Kullanıcı Sil
// @Description Verilen ID'ye sahip kullanıcıyı siler.
// @Tags Users
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Success 204
// @Failure 500 {object} map[string]string
// @Router /users/{id} [delete]
func (h *UserHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := h.service.Delete(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusNoContent, nil)
}