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
	jwtSecret string // Secret'ı buraya enjekte edeceğiz
}

// Constructor'a secret parametresi eklendi
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

	// JWT Oluşturma Aşaması
	token, err := s.generateToken(user)
	if err != nil {
		return "", nil, errors.New("error generating token")
	}

	return token, user, nil
}

func (s *authService) Register(ctx context.Context, user *domain.User) error {
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

	return s.repo.Create(ctx, user)
}

// Helper: Token üretme fonksiyonu (private)
func (s *authService) generateToken(user *domain.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID.Hex(),
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // 72 saat geçerli
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}