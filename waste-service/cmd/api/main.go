package main

import (
	"context"
	"log"
	"net/http" // <--- 1. Bunu ekledim (Method sabitleri için)
	"time"
	"waste-service/internal/config"
	handler "waste-service/internal/handler/http"
	"waste-service/internal/middleware"
	"waste-service/internal/repository"
	"waste-service/internal/service"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// 1. Ayarları Yükle
	cfg := config.LoadConfig()

	// 2. Database Bağlantısı
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database(cfg.DbName)

	// 3. Katmanları Başlat (Dependency Injection)
	repo := repository.NewMongoRepository(db)
	svc := service.NewWasteService(repo, cfg.AIServiceURL)
	h := handler.NewWasteHandler(svc)

	// Demo veri ekle (Harita boş gelmesin)
	repo.SeedPoints(context.Background())
	repo.SeedWastes(context.Background())

	// Debug: Etki analizi sonuçlarını kontrol et
	go func() {
		time.Sleep(2 * time.Second)
		impact, err := svc.GetImpactAnalysis(context.Background())
		if err != nil {
			log.Printf("❌ Etki analizi hatası: %v", err)
		} else {
			log.Printf("✅ Etki Analizi:")
			log.Printf("   - İşlenen Atık: %d", impact.TotalWasteProcessed)
			log.Printf("   - CO₂: %.1f kg", impact.TotalCO2Saved)
			log.Printf("   - Su: %.0f L", impact.TotalWaterSaved)
			log.Printf("   - Enerji: %.0f kWh", impact.TotalEnergyEquivalent)
		}
	}()

	// 4. Echo Server
	e := echo.New()

	// ==========================================
	// 2. CORS AYARLARI BURAYA (DİĞERİYLE AYNI)
	// ==========================================
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())

	// Static dosya sunumu (Yüklenen resimlere tarayıcıdan erişmek için)
	e.Static("/uploads", "./uploads")

	// 5. Public Rotalar (Auth gerektirmeyen)
	publicGroup := e.Group("/api")
	publicGroup.GET("/impact-analysis", func(c echo.Context) error {
		return h.GetImpactAnalysis(c)
	})
	// Upload endpoint'i public yap (oturum açmadan da kullanılabilir)
	publicGroup.POST("/upload", h.Upload)
	// Çoklu cihaz bildirimi endpoint'i de public (guest kullanıcılar da kullanabilir)
	publicGroup.POST("/devices/multiple", h.SubmitMultipleDevices)
	// Points endpoint'i AUTH GEREKTİRİR (harita için login zorunlu)
	// publicGroup.GET("/points", h.GetPoints) // ❌ Bu satırı kaldırdık

	// 6. Korumalı Rotalar (Auth gerektiren)
	// Tüm /api rotaları Auth korumasında olacak
	apiGroup := e.Group("/api")
	apiGroup.Use(middleware.AuthGuard(cfg.AuthServiceURL))

	// Harita noktaları için login gerekli
	apiGroup.GET("/points", h.GetPoints)

	h.RegisterRoutes(apiGroup)

	// 7. Başlat
	log.Printf("Waste Service running on port %s", cfg.Port)
	e.Logger.Fatal(e.Start(":" + cfg.Port))
}
