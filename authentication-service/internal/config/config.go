package config

import (
	"os"
)

type Config struct {
	MongoURI  string
	DbName    string
	Port      string
	JWTSecret string 
}

func LoadConfig() *Config {
	return &Config{
		MongoURI:  getEnv("MONGO_URI", "mongodb://admin:password123@localhost:27017"),
		DbName:    getEnv("DB_NAME", "auth_db"),
		Port:      getEnv("PORT", "8080"),
		JWTSecret: getEnv("JWT_SECRET", "super_secret_key_change_me"), 
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}