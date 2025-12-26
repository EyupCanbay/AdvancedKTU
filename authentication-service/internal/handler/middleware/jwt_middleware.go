package middleware

import (
    "net/http"
    "strings"

    "github.com/golang-jwt/jwt/v5" // v5 kullandığını varsayıyorum
    "github.com/labstack/echo/v4"
)

func JWTMiddleware(secretKey string) echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            // 1. Header'dan Authorization bilgisini al
            authHeader := c.Request().Header.Get("Authorization")
            if authHeader == "" {
                return c.JSON(http.StatusUnauthorized, map[string]string{"error": "missing authorization header"})
            }

            // 2. Format kontrolü: "Bearer " ile mi başlıyor?
            // "Bearer " (boşluklu) 7 karakterdir.
            if len(authHeader) < 7 || !strings.EqualFold(authHeader[:7], "Bearer ") {
                return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid authorization header format"})
            }

            // 3. "Bearer " kısmını at, sadece token'ı al
            tokenString := authHeader[7:]

            // 4. Token'ı parse et ve imzayı doğrula
            token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
                // Algoritma kontrolü (Önemli güvenlik adımı)
                if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                    return nil, echo.ErrUnauthorized
                }
                return []byte(secretKey), nil
            })

            if err != nil || !token.Valid {
                return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid or expired token"})
            }

            // 5. KRİTİK NOKTA: Token'ı context'e "user" anahtarıyla kaydet!
            // Handler tarafında c.Get("user") dediğinde buraya erişirsin.
            c.Set("user", token)

            return next(c)
        }
    }
}