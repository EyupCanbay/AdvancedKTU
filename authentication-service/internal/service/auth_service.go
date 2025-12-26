package service

import (
	"authentication-service/internal/domain"
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type authService struct {
	repo      domain.UserRepository
	jwtSecret string
}

func NewAuthService(repo domain.UserRepository, secret string) domain.AuthService {
	return &authService{
		repo:      repo,
		jwtSecret: secret,
	}
}

func (s *authService) Login(ctx context.Context, email, password string) (string, *domain.User, error) {
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	if !user.Active {
		return "", nil, errors.New("user is not active")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return "", nil, errors.New("error generating token")
	}

	return token, user, nil
}

func (s *authService) Register(ctx context.Context, user *domain.User) error {
	// 1. Validasyon: Adres Kontrolü
	if len(user.Addresses) == 0 {
		return errors.New("at least one address is required")
	}

	// 2. Validasyon: Email Kontrolü
	existing, _ := s.repo.GetByEmail(ctx, user.Email)
	if existing != nil {
		return errors.New("email already in use")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	user.Active = true
	user.Role = "user" // Yeni kullanıcılar default "user" rolü alır

	return s.repo.Create(ctx, user)
}

func (s *authService) generateToken(user *domain.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID.Hex(),
		"email":   user.Email,
		"role":    user.Role, // Rol'ü token'a ekle
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
