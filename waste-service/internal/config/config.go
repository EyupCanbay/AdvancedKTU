package config

import "os"

type Config struct {
	Port           string
	MongoURI       string
	DbName         string
	AuthServiceURL string // Auth servisine istek atmak için
	AIServiceURL   string // AI servisine istek atmak için
}

func LoadConfig() *Config {
	return &Config{
		Port:           getEnv("PORT", "8081"), // Auth 8080 ise bu 8081 olsun
		MongoURI:       getEnv("MONGO_URI", "mongodb://admin:password123@localhost:27017"),
		DbName:         getEnv("DB_NAME", "waste_db"),
		AuthServiceURL: getEnv("AUTH_SERVICE_URL", "http://localhost:8080"),
		AIServiceURL:   getEnv("AI_SERVICE_URL", "http://localhost:3000/risk-degree"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
