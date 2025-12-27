package repository

import (
	"authentication-service/internal/domain"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type mongoRepository struct {
	db *mongo.Database
}

func NewMongoRepository(db *mongo.Database) domain.UserRepository {
	return &mongoRepository{
		db: db,
	}
}

func (m *mongoRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	collection := m.db.Collection("users")
	var user domain.User

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	filter := bson.M{"email": email}
	err := collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

func (m *mongoRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	collection := m.db.Collection("users")
	var user domain.User

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid id format")
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	filter := bson.M{"_id": objectId}
	err = collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (m *mongoRepository) GetAll(ctx context.Context) ([]*domain.User, error) {
	collection := m.db.Collection("users")
	var users []*domain.User

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// Sadece deleted_at == nil olan kullanıcıları getir (soft delete)
	cursor, err := collection.Find(ctx, bson.M{"deleted_at": nil})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &users); err != nil {
		return nil, err
	}
	return users, nil
}

func (m *mongoRepository) Create(ctx context.Context, user *domain.User) error {
	collection := m.db.Collection("users")

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.ID = primitive.NewObjectID()

	_, err := collection.InsertOne(ctx, user)
	return err
}

func (m *mongoRepository) Update(ctx context.Context, user *domain.User) error {
	collection := m.db.Collection("users")

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	user.UpdatedAt = time.Now()
	filter := bson.M{"_id": user.ID}
	update := bson.M{"$set": user}

	_, err := collection.UpdateOne(ctx, filter, update)
	return err
}

func (m *mongoRepository) Delete(ctx context.Context, id string) error {
	collection := m.db.Collection("users")

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid id")
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	// Hard delete yerine soft delete: deleted_at alanını set et
	now := time.Now()
	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": objectId},
		bson.M{"$set": bson.M{
			"deleted_at": now,
			"active":     false, // Pasif yap ama adresleri vs silme
			"updated_at": now,
		}},
	)
	return err
}

// SeedUsers creates demo users for testing
func (m *mongoRepository) SeedUsers(ctx context.Context) error {
	collection := m.db.Collection("users")

	// Drop existing users for development
	collection.DeleteMany(ctx, bson.M{})

	// Hash password for admin user
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)

	adminUser := &domain.User{
		ID:        primitive.NewObjectID(),
		Email:     "admin@example.com",
		FirstName: "Admin",
		LastName:  "User",
		Password:  string(hashedPassword),
		Role:      "admin", // Admin rolü
		Addresses: []domain.Address{
			{
				Title:       "Office",
				City:        "Istanbul",
				District:    "Kadikoy",
				FullAddress: "Kanuni Kampüsü, Istanbul",
			},
		},
		Active:    true,
		DeletedAt: nil,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Demo user
	userUser := &domain.User{
		ID:        primitive.NewObjectID(),
		Email:     "user@example.com",
		FirstName: "Test",
		LastName:  "User",
		Password:  string(hashedPassword),
		Role:      "user", // Normal user rolü
		Addresses: []domain.Address{
			{
				Title:       "Home",
				City:        "Istanbul",
				District:    "Besiktas",
				FullAddress: "Test Address, Istanbul",
			},
		},
		Active:    true,
		DeletedAt: nil,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err := collection.InsertMany(ctx, []interface{}{adminUser, userUser})
	return err
}
