package main

import (
	"authentication-service/internal/config"
	handler "authentication-service/internal/handler/http"
	customMiddleware "authentication-service/internal/handler/middleware"
	"authentication-service/internal/repository"
	"authentication-service/internal/service"
	"context"
	"log"
	"net/http" // HTTP metodları için (http.MethodGet vs.) bunu eklemeyi unutma
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware" // <--- 1. BU IMPORT'U EKLE
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	_ "authentication-service/docs"

	echoSwagger "github.com/swaggo/echo-swagger"
)

// ... (Swagger yorumların aynı kalacak) ...

func main() {
	cfg := config.LoadConfig()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// ... (Database bağlantıları aynı) ...
	clientOptions := options.Client().ApplyURI(cfg.MongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("MongoDB not reachable: %v", err)
	}
	db := client.Database(cfg.DbName)

	userRepo := repository.NewMongoRepository(db)
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	userService := service.NewUserService(userRepo)

	// Seed demo users
	if err := userRepo.SeedUsers(context.Background()); err != nil {
		log.Printf("Seed users error: %v", err)
	} else {
		log.Println("Demo users seeded successfully")
	}

	// AuthHandler düzeltmesi: Önceki hatanı hatırlayarak, buraya config'i eklemen gerekebilir.
	// Eğer NewAuthHandler fonksiyonunu düzelttiysen şöyle olmalı:
	// authHandler := handler.NewAuthHandler(authService, cfg)
	// Ama şimdilik senin attığın koda sadık kalıyorum:
	authHandler := handler.NewAuthHandler(authService)

	userHandler := handler.NewUserHandler(userService)

	// 5. Echo Server Kurulumu
	e := echo.New()

	// ==========================================
	// 2. CORS AYARLARI BURAYA (En üste ekle)
	// ==========================================
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"}, // Geliştirme aşamasında "*" (herkes) iyidir. Prod'da "https://site.com" yaparsın.
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Logger ve Recover middleware'lerini de eklemek iyi pratiktir:
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// SWAGGER ROUTE
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// ... (Rota tanımları aynı) ...
	authHandler.RegisterRoutes(e)

	userGroup := e.Group("/users")
	userGroup.Use(customMiddleware.JWTMiddleware(cfg.JWTSecret))

	// Herkese açık user endpoints
	userGroup.GET("", userHandler.GetAll)
	userGroup.GET("/:id", userHandler.GetByID)
	userGroup.PUT("/:id", userHandler.Update)

	// Admin-only endpoints
	adminGroup := e.Group("/admin/users")
	adminGroup.Use(customMiddleware.JWTMiddleware(cfg.JWTSecret))
	adminGroup.Use(customMiddleware.AdminMiddleware)

	adminGroup.POST("", userHandler.Create)             // Sadece admin yeni user ekleyebilir
	adminGroup.DELETE("/:id", userHandler.Delete)       // Sadece admin user silebilir
	adminGroup.PUT("/:id/role", userHandler.ChangeRole) // Sadece admin role değiştirebilir

	log.Printf("Server running on port %s", cfg.Port)
	e.Logger.Fatal(e.Start(":" + cfg.Port))
}
