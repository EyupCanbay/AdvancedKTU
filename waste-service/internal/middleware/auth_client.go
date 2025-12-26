package middleware

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Auth servisinden dönecek cevap yapısı (ValidateToken endpointine göre)
type ValidateResponse struct {
	Valid  bool   `json:"valid"`
	UserID string `json:"user_id"`
}

func AuthGuard(authServiceURL string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 1. Header'dan Token'ı al
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Token gerekli"})
			}

			// 2. Auth Servisine İstek At
			client := &http.Client{}
			// Auth servisi url'i config'den geliyor
			req, _ := http.NewRequest("GET", authServiceURL+"/auth/validate", nil)
			req.Header.Set("Authorization", authHeader)

			resp, err := client.Do(req)
			if err != nil || resp.StatusCode != http.StatusOK {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Token geçersiz veya Auth servisi kapalı"})
			}
			defer resp.Body.Close()

			// 3. Gelen cevabı oku ve UserID'yi al
			var valResp ValidateResponse
			if err := json.NewDecoder(resp.Body).Decode(&valResp); err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Auth yanıtı okunamadı"})
			}

			// 4. UserID'yi context'e koy (Handler'da kullanmak için)
			c.Set("userID", valResp.UserID)

			return next(c)
		}
	}
}