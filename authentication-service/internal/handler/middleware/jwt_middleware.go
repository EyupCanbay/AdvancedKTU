package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// JWTMiddleware, korumalı rotalar için token kontrolü yapar
func JWTMiddleware(secret string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 1. Header'dan token'ı al (Authorization: Bearer <token>)
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "missing authorization header"})
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid header format"})
			}

			tokenString := parts[1]

			// 2. Token'ı parse et ve doğrula
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				// Algoritma kontrolü (HMAC olmalı)
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, echo.ErrUnauthorized
				}
				return []byte(secret), nil
			})

			if err != nil || !token.Valid {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid or expired token"})
			}

			// 3. Claimleri al ve Context'e yükle (ileride handler içinde kullanmak için)
			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				c.Set("user_id", claims["user_id"])
				c.Set("email", claims["email"])
			}

			return next(c)
		}
	}
}