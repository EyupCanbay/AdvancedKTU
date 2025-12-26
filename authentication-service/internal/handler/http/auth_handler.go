package http

import (
	"authentication-service/internal/domain"
	"net/http"

	cfg "authentication-service/internal/config"
	customMiddleware "authentication-service/internal/handler/middleware"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	service domain.AuthService
	config  *cfg.Config
}

func NewAuthHandler(service domain.AuthService) *AuthHandler {
	return &AuthHandler{
		service: service,
		config:  cfg.LoadConfig(),
	}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// RegisterRequest güncellendi: Adres listesi eklendi
type RegisterRequest struct {
	Email     string           `json:"email"`
	Password  string           `json:"password"`
	FirstName string           `json:"first_name"`
	LastName  string           `json:"last_name"`
	Addresses []domain.Address `json:"addresses"` // Zorunlu alan
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
	e.GET("/auth/validate", h.ValidateToken, customMiddleware.JWTMiddleware(h.config.JWTSecret))
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
// @Description Sisteme yeni bir kullanıcı ekler. En az bir adres girilmesi zorunludur.
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "Kayıt Bilgileri (Adres Dahil)"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /auth/register [post]
func (h *AuthHandler) Register(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	// Handler seviyesinde basit validasyon (Business logic'te de tekrar kontrol edilecek)
	if len(req.Addresses) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "at least one address is required"})
	}

	user := &domain.User{
		Email:     req.Email,
		Password:  req.Password,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Addresses: req.Addresses, // Adresleri map ediyoruz
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

// ValidateToken godoc
// @Summary Token Doğrulama
// @Description Diğer mikroservislerin token kontrolü yapması için kullanılır.
// @Tags Auth
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Failure 401 {object} map[string]string
// @Router /auth/validate [get]
func (h *AuthHandler) ValidateToken(c echo.Context) error {
	// 1. Context'ten veriyi güvenli al
	rawData := c.Get("user")

	// Eğer middleware bunu set etmediyse nil gelir
	if rawData == nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "token not found in context"})
	}

	// 2. Tipi güvenli şekilde dönüştür (Type Assertion)
	user, ok := rawData.(*jwt.Token)
	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "invalid token format in context"})
	}

	claims, ok := user.Claims.(jwt.MapClaims)
	if !ok || !user.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid token claims"})
	}

	// Güvenli şekilde userID'yi al (Burası da patlayabilir, kontrol edelim)
	userID, ok := claims["user_id"].(string)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "user_id not found in token"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"valid":   true,
		"user_id": userID,
	})
}
