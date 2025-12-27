package service

import (
	"authentication-service/internal/domain"
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type userService struct {
	repo domain.UserRepository
}

func NewUserService(repo domain.UserRepository) domain.UserService {
	return &userService{
		repo: repo,
	}
}

func (s *userService) Get(ctx context.Context, id string) (*domain.User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *userService) GetAll(ctx context.Context) ([]*domain.User, error) {
	return s.repo.GetAll(ctx)
}

func (s *userService) Create(ctx context.Context, user *domain.User) error {
	// Admin manuel ekleme yaparken de adres zorunlu
	if len(user.Addresses) == 0 {
		return errors.New("at least one address is required")
	}

	existing, _ := s.repo.GetByEmail(ctx, user.Email)
	if existing != nil {
		return errors.New("email already exists")
	}

	if user.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashed)
	}

	user.Active = true
	if user.Role == "" {
		user.Role = "user" // Default rol
	}
	return s.repo.Create(ctx, user)
}

func (s *userService) Update(ctx context.Context, id string, user *domain.User) error {
	existing, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	existing.FirstName = user.FirstName
	existing.LastName = user.LastName
	existing.Email = user.Email
	existing.Active = user.Active
	existing.Role = user.Role // Role'ü güncelle

	// Eğer güncelleme isteğinde adres gönderilmişse güncelle, boşsa eskisini koru veya hata fırlat
	// Senaryo: Adres listesi tamamen değiştirilmek isteniyor olabilir.
	if len(user.Addresses) > 0 {
		existing.Addresses = user.Addresses
	}
	// Not: Eğer kullanıcı adreslerini tamamen silmeye çalışırsa (boş array yollarsa)
	// yukarıdaki if bloğu çalışmaz ve eski adresler kalır.
	// Eğer silmeye izin verilmeyecekse bu mantık doğrudur (En az 1 adres kuralı).

	if user.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		existing.Password = string(hashed)
	}

	return s.repo.Update(ctx, existing)
}

func (s *userService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
