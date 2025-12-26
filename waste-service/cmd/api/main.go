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
    if err != nil { log.Fatal(err) }
    
    db := client.Database(cfg.DbName)

    // 3. Katmanları Başlat (Dependency Injection)
    repo := repository.NewMongoRepository(db)
    svc := service.NewWasteService(repo, cfg.AIServiceURL)
    h := handler.NewWasteHandler(svc)

    // Demo veri ekle (Harita boş gelmesin)
    repo.SeedPoints(context.Background())

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

    // 5. Rotalar ve Middleware
    // Tüm /api rotaları Auth korumasında olacak
    apiGroup := e.Group("/api")
    apiGroup.Use(middleware.AuthGuard(cfg.AuthServiceURL))
    
    h.RegisterRoutes(apiGroup)

    // 6. Başlat
    log.Printf("Waste Service running on port %s", cfg.Port)
    e.Logger.Fatal(e.Start(":" + cfg.Port))
}