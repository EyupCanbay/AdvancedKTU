package repository

import (
	"context"
	"time"
	"waste-service/internal/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type mongoRepository struct {
	db *mongo.Database
}

func NewMongoRepository(db *mongo.Database) domain.WasteRepository {
	return &mongoRepository{db: db}
}

func (m *mongoRepository) Create(ctx context.Context, waste *domain.Waste) error {
	waste.ID = primitive.NewObjectID()
	waste.CreatedAt = time.Now()
	_, err := m.db.Collection("wastes").InsertOne(ctx, waste)
	return err
}

func (m *mongoRepository) UpdateAnalysis(ctx context.Context, id primitive.ObjectID, analysis *domain.AIAnalysisResult) error {
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"ai_analysis": analysis,
			"status":      "analyzed",
		},
	}
	_, err := m.db.Collection("wastes").UpdateOne(ctx, filter, update)
	return err
}

func (m *mongoRepository) GetAllPoints(ctx context.Context) ([]*domain.CollectionPoint, error) {
	var points []*domain.CollectionPoint
	cursor, err := m.db.Collection("points").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &points); err != nil {
		return nil, err
	}
	return points, nil
}

func (m *mongoRepository) CreateRequest(ctx context.Context, req *domain.CollectionRequest) error {
	req.ID = primitive.NewObjectID()
	req.CreatedAt = time.Now()
	_, err := m.db.Collection("requests").InsertOne(ctx, req)
	return err
}

// Proje ilk açıldığında haritada nokta görünsün diye sahte veri basar
func (m *mongoRepository) SeedPoints(ctx context.Context) error {
    count, _ := m.db.Collection("points").CountDocuments(ctx, bson.M{})
    if count > 0 { return nil }

    points := []interface{}{
        domain.CollectionPoint{Name: "KTÜ Toplama Merkezi", Latitude: 40.995, Longitude: 39.771, Address: "Kanuni Kampüsü"},
        domain.CollectionPoint{Name: "Meydan Geri Dönüşüm", Latitude: 41.005, Longitude: 39.722, Address: "Meydan Parkı Yanı"},
    }
    _, err := m.db.Collection("points").InsertMany(ctx, points)
    return err
}