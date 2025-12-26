package domain

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Address Value Object
type Address struct {
	Title       string `bson:"title" json:"title" example:"Ev"`
	City        string `bson:"city" json:"city" example:"Istanbul"`
	District    string `bson:"district" json:"district" example:"Kadikoy"`
	FullAddress string `bson:"full_address" json:"full_address" example:"Caferaga mah. Moda cad. No:1"`
}

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	FirstName string             `bson:"first_name" json:"first_name"`
	LastName  string             `bson:"last_name" json:"last_name"`
	Password  string             `bson:"password" json:"-"`
	Addresses []Address `bson:"addresses" json:"addresses"`
	Active    bool      `bson:"active" json:"active"`
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	GetAll(ctx context.Context) ([]*User, error)
	Create(ctx context.Context, user *User) error
	Update(ctx context.Context, user *User) error
	Delete(ctx context.Context, id string) error
}

type AuthService interface {
	Login(ctx context.Context, email, password string) (string, *User, error)
	Register(ctx context.Context, user *User) error
}

type UserService interface {
	Get(ctx context.Context, id string) (*User, error)
	GetAll(ctx context.Context) ([]*User, error)
	Create(ctx context.Context, user *User) error
	Update(ctx context.Context, id string, user *User) error
	Delete(ctx context.Context, id string) error
}