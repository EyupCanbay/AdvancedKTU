package middleware

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// AdminMiddleware sadece admin rolüne sahip kullanıcıları geçirir
func AdminMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// JWT token'ı context'ten al
		user := c.Get("user")
		if user == nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		}

		token, ok := user.(*jwt.Token)
		if !ok {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid token"})
		}

		// Claims'ten role'ü al
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid claims"})
		}

		role, ok := claims["role"].(string)
		if !ok || role != "admin" {
			return c.JSON(http.StatusForbidden, map[string]string{"error": "admin role required"})
		}

		return next(c)
	}
}
