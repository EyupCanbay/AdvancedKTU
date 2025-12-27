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

func (m *mongoRepository) GetWastes(ctx context.Context) ([]*domain.Waste, error) {
	var wastes []*domain.Waste
	cursor, err := m.db.Collection("wastes").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &wastes); err != nil {
		return nil, err
	}
	return wastes, nil
}

func (m *mongoRepository) UpdateWasteStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	collection := m.db.Collection("wastes")
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"status": status,
		},
	}
	_, err := collection.UpdateOne(ctx, filter, update)
	return err
}

func (m *mongoRepository) DeleteWaste(ctx context.Context, id primitive.ObjectID) error {
	collection := m.db.Collection("wastes")
	filter := bson.M{"_id": id}
	_, err := collection.DeleteOne(ctx, filter)
	return err
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
	if count > 0 {
		return nil
	}

	points := []interface{}{
		domain.CollectionPoint{Name: "KTÜ Toplama Merkezi", Latitude: 40.995, Longitude: 39.771, Address: "Kanuni Kampüsü"},
		domain.CollectionPoint{Name: "Meydan Geri Dönüşüm", Latitude: 41.005, Longitude: 39.722, Address: "Meydan Parkı Yanı"},
	}
	_, err := m.db.Collection("points").InsertMany(ctx, points)
	return err
}

// --- YENİ EKLENEN METODLAR (NOKTA YÖNETİMİ) ---

func (m *mongoRepository) CreatePoint(ctx context.Context, point *domain.CollectionPoint) error {
	point.ID = primitive.NewObjectID()
	_, err := m.db.Collection("points").InsertOne(ctx, point)
	return err
}

func (m *mongoRepository) UpdatePoint(ctx context.Context, id primitive.ObjectID, point *domain.CollectionPoint) error {
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"name":      point.Name,
			"latitude":  point.Latitude,
			"longitude": point.Longitude,
			"address":   point.Address,
		},
	}
	_, err := m.db.Collection("points").UpdateOne(ctx, filter, update)
	return err
}

func (m *mongoRepository) DeletePoint(ctx context.Context, id primitive.ObjectID) error {
	filter := bson.M{"_id": id}
	_, err := m.db.Collection("points").DeleteOne(ctx, filter)
	return err
}

// SeedWastes creates demo waste records for testing
func (m *mongoRepository) SeedWastes(ctx context.Context) error {
	collection := m.db.Collection("wastes")

	// Eğer zaten veri varsa, tekrar ekleme
	count, _ := collection.CountDocuments(ctx, bson.M{})
	if count > 0 {
		return nil
	}

	wasteRecords := []interface{}{
		&domain.Waste{
			ID:          primitive.NewObjectID(),
			UserID:      "admin@example.com",
			ImagePath:   "/uploads/waste_1.jpg",
			Description: "Elektronik atık - Eski telefon",
			Status:      "analyzed",
			AIAnalysis: &domain.AIAnalysisResult{
				FullyChargingPhones:              5,
				LightHours:                       120,
				LedLighting:                      450,
				DrivingCar:                       25.5,
				CO2Emission:                      125.5,
				CleanWater:                       1200,
				SoilDegradation:                  450,
				ContaminatingGroundwater:         300,
				EnergyConsumptionOfSmallWorkshop: 85,
				LossRareEarthElements:            12.5,
				MicroplasticPollutionMarineLife:  65,
				AnnualCarbonSequestrationTree:    15,
				HouseholdElectricityConsumption:  180,
				DailyWaterConsumptionPeople:      200,
				HumanCarbonFootprintOneDay:       2.5,
				RiskDegree:                       8,
				Cost:                             450000,
			},
			CreatedAt: time.Now().AddDate(0, 0, -5),
		},
		&domain.Waste{
			ID:          primitive.NewObjectID(),
			UserID:      "admin@example.com",
			ImagePath:   "/uploads/waste_2.jpg",
			Description: "Plastik atık - PET şişeler",
			Status:      "pending",
			AIAnalysis: &domain.AIAnalysisResult{
				FullyChargingPhones:              2,
				LightHours:                       45,
				LedLighting:                      200,
				DrivingCar:                       8.2,
				CO2Emission:                      42.3,
				CleanWater:                       450,
				SoilDegradation:                  120,
				ContaminatingGroundwater:         85,
				EnergyConsumptionOfSmallWorkshop: 25,
				LossRareEarthElements:            2.1,
				MicroplasticPollutionMarineLife:  155,
				AnnualCarbonSequestrationTree:    4,
				HouseholdElectricityConsumption:  55,
				DailyWaterConsumptionPeople:      75,
				HumanCarbonFootprintOneDay:       0.8,
				RiskDegree:                       4,
				Cost:                             15000,
			},
			CreatedAt: time.Now().AddDate(0, 0, -3),
		},
		&domain.Waste{
			ID:          primitive.NewObjectID(),
			UserID:      "admin@example.com",
			ImagePath:   "/uploads/waste_3.jpg",
			Description: "Metal atık - Alüminyum kutular",
			Status:      "collected",
			AIAnalysis: &domain.AIAnalysisResult{
				FullyChargingPhones:              8,
				LightHours:                       200,
				LedLighting:                      750,
				DrivingCar:                       45.5,
				CO2Emission:                      220.5,
				CleanWater:                       2100,
				SoilDegradation:                  800,
				ContaminatingGroundwater:         520,
				EnergyConsumptionOfSmallWorkshop: 145,
				LossRareEarthElements:            28.5,
				MicroplasticPollutionMarineLife:  12,
				AnnualCarbonSequestrationTree:    32,
				HouseholdElectricityConsumption:  320,
				DailyWaterConsumptionPeople:      450,
				HumanCarbonFootprintOneDay:       4.5,
				RiskDegree:                       6,
				Cost:                             750000,
			},
			CreatedAt: time.Now().AddDate(0, 0, -1),
		},
		&domain.Waste{
			ID:          primitive.NewObjectID(),
			UserID:      "admin@example.com",
			ImagePath:   "/uploads/waste_4.jpg",
			Description: "Cam atık - Şişeler ve kavanozlar",
			Status:      "analyzed",
			AIAnalysis: &domain.AIAnalysisResult{
				FullyChargingPhones:              3,
				LightHours:                       80,
				LedLighting:                      300,
				DrivingCar:                       12.5,
				CO2Emission:                      60.5,
				CleanWater:                       800,
				SoilDegradation:                  200,
				ContaminatingGroundwater:         150,
				EnergyConsumptionOfSmallWorkshop: 40,
				LossRareEarthElements:            5.5,
				MicroplasticPollutionMarineLife:  8,
				AnnualCarbonSequestrationTree:    8,
				HouseholdElectricityConsumption:  90,
				DailyWaterConsumptionPeople:      120,
				HumanCarbonFootprintOneDay:       1.2,
				RiskDegree:                       3,
				Cost:                             120000,
			},
			CreatedAt: time.Now(),
		},
	}

	_, err := collection.InsertMany(ctx, wasteRecords)
	return err
}

// GetImpactStats - Gerçek Zamanlı Etki Analizi
func (m *mongoRepository) GetImpactStats(ctx context.Context) (*domain.ImpactAnalysis, error) {
	collection := m.db.Collection("wastes")

	// Tüm analyzed ve collected durumundaki atıkları çek
	filter := bson.M{"status": bson.M{"$in": []string{"analyzed", "pending", "collected"}}}
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var wastes []*domain.Waste
	if err = cursor.All(ctx, &wastes); err != nil {
		return nil, err
	}

	// Toplam metrikleri hesapla
	impact := &domain.ImpactAnalysis{
		LastUpdated: time.Now(),
	}

	highRiskCount := 0
	for _, w := range wastes {
		if w.AIAnalysis == nil {
			continue
		}

		impact.TotalCO2Saved += w.AIAnalysis.CO2Emission
		impact.TotalEnergyEquivalent += w.AIAnalysis.LedLighting
		impact.TotalWaterSaved += w.AIAnalysis.CleanWater
		impact.TreesEquivalent += w.AIAnalysis.AnnualCarbonSequestrationTree
		impact.CarsOffRoad += w.AIAnalysis.DrivingCar
		impact.PhonesCharged += w.AIAnalysis.FullyChargingPhones
		impact.LightHoursTotal += w.AIAnalysis.LightHours

		if w.AIAnalysis.RiskDegree >= 7 {
			highRiskCount++
		}
	}

	impact.TotalWasteProcessed = len(wastes)
	impact.HighRiskWastes = highRiskCount

	return impact, nil
}
