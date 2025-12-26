package main

import (
	"authentication-service/internal/config"
	handler "authentication-service/internal/handler/http"
	customMiddleware "authentication-service/internal/handler/middleware"
	"authentication-service/internal/repository"
	"authentication-service/internal/service"
	"context"
	"log"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	
	// Swagger dependencies
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "authentication-service/docs" // Bu satır swag init yapınca oluşan docs paketini import eder
)

// @title Authentication Service API
// @version 1.0
// @description Go, Echo ve MongoDB kullanılan örnek bir authentication servisi.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	cfg := config.LoadConfig()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 1. Database Bağlantısı
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

	// 2. Repository Başlatma
	userRepo := repository.NewMongoRepository(db)

	// 3. Service Başlatma
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	userService := service.NewUserService(userRepo)

	// 4. Handler Başlatma
	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userService)

	// 5. Echo Server Kurulumu
	e := echo.New()

	// SWAGGER ROUTE
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// 6. Rota Tanımları

	// HERKESE AÇIK ROTALAR (Public)
	authHandler.RegisterRoutes(e)

	// KORUMALI ROTALAR (Protected)
	userGroup := e.Group("/users")
	userGroup.Use(customMiddleware.JWTMiddleware(cfg.JWTSecret))

	userGroup.GET("", userHandler.GetAll)
	userGroup.GET("/:id", userHandler.GetByID)
	userGroup.POST("", userHandler.Create)
	userGroup.PUT("/:id", userHandler.Update)
	userGroup.DELETE("/:id", userHandler.Delete)

	log.Printf("Server running on port %s", cfg.Port)
	e.Logger.Fatal(e.Start(":" + cfg.Port))
}