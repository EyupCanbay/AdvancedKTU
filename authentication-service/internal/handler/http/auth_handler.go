package http

import (
	"authentication-service/internal/domain"
	"net/http"

	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	service domain.AuthService
}

func NewAuthHandler(service domain.AuthService) *AuthHandler {
	return &AuthHandler{
		service: service,
	}
}

// Swagger'ın görmesi için struct isimleri büyük harfle başlamalı
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type LoginResponse struct {
	Message string       `json:"message"`
	Token   string       `json:"token"`
	User    *domain.User `json:"user"`
}

func (h *AuthHandler) RegisterRoutes(e *echo.Echo) {
	e.POST("/auth/login", h.Login)
	e.POST("/auth/register", h.Register)
	e.GET("/health", h.HealthCheck)
}

// Login godoc
// @Summary Kullanıcı Girişi
// @Description Email ve şifre ile giriş yapar, JWT token döner.
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Giriş Bilgileri"
// @Success 200 {object} LoginResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /auth/login [post]
func (h *AuthHandler) Login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	token, user, err := h.service.Login(c.Request().Context(), req.Email, req.Password)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, LoginResponse{
		Message: "login successful",
		Token:   token,
		User:    user,
	})
}

// Register godoc
// @Summary Yeni Kullanıcı Kaydı
// @Description Sisteme yeni bir kullanıcı ekler.
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "Kayıt Bilgileri"
// @Success 210 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /auth/register [post]
func (h *AuthHandler) Register(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	user := &domain.User{
		Email:     req.Email,
		Password:  req.Password,
		FirstName: req.FirstName,
		LastName:  req.LastName,
	}

	if err := h.service.Register(c.Request().Context(), user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]string{"message": "user created"})
}

// HealthCheck godoc
// @Summary Sistem Sağlık Kontrolü
// @Description API'nin çalışıp çalışmadığını kontrol eder.
// @Tags System
// @Produce json
// @Success 200 {object} map[string]string
// @Router /health [get]
func (h *AuthHandler) HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}