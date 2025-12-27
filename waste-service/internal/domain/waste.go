package domain

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// --- MODELLER ---

type Waste struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      string             `bson:"user_id" json:"user_id"`
	ImagePath   string             `bson:"image_path" json:"image_path"` // Local dosya yolu
	Description string             `bson:"description" json:"description"`
	AIAnalysis  *AIAnalysisResult  `bson:"ai_analysis,omitempty" json:"ai_analysis"`
	Status      string             `bson:"status" json:"status"` // analyzing, pending, collected
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}

type AIAnalysisResult struct {
	FullyChargingPhones              int     `bson:"fully_charging_phones" json:"fullyChargingPhones"`
	LightHours                       float64 `bson:"light_hours" json:"lightHours"`
	LedLighting                      float64 `bson:"led_lighting" json:"ledLighting"`
	DrivingCar                       float64 `bson:"driving_car" json:"drivingCar"`
	CO2Emission                      float64 `bson:"co2_emission" json:"CO2Emission"`
	CleanWater                       float64 `bson:"clean_water" json:"cleanWater"`
	SoilDegradation                  float64 `bson:"soil_degradation" json:"soilDegradation"`
	ContaminatingGroundwater         float64 `bson:"contaminating_groundwater" json:"contaminatingGroundwater"`
	EnergyConsumptionOfSmallWorkshop float64 `bson:"energy_consumption_workshop" json:"energyConsumptionOfSmallWorkshop"`
	LossRareEarthElements            float64 `bson:"loss_rare_earth_elements" json:"lossRareEarthElements"`
	MicroplasticPollutionMarineLife  float64 `bson:"microplastic_pollution" json:"microplasticPollutionMarineLife"`
	AnnualCarbonSequestrationTree    float64 `bson:"carbon_sequestration_tree" json:"annualCarbonSequestrationCapacityTree"`
	HouseholdElectricityConsumption  float64 `bson:"household_electricity" json:"householdElectricityConsumption"`
	DailyWaterConsumptionPeople      float64 `bson:"daily_water_consumption" json:"dailyWaterConsumptionPeople"`
	HumanCarbonFootprintOneDay       float64 `bson:"human_carbon_footprint" json:"humanCarbonFootprintOneDay"`
	RiskDegree                       int     `bson:"risk_degree" json:"riskDegree"`
	Cost                             float64 `bson:"cost" json:"cost"`
}

// Haritadaki noktalar (Belediye kutuları vb.)
type CollectionPoint struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name"`
	Latitude  float64            `bson:"latitude" json:"latitude"`
	Longitude float64            `bson:"longitude" json:"longitude"`
	Address   string             `bson:"address" json:"address"`
}

// Kullanıcının oluşturduğu talep
type CollectionRequest struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID            string             `bson:"user_id" json:"user_id"`
	WasteID           primitive.ObjectID `bson:"waste_id" json:"waste_id"`
	CollectionPointID primitive.ObjectID `bson:"collection_point_id" json:"collection_point_id"`
	Status            string             `bson:"status" json:"status"` // created, completed
	CreatedAt         time.Time          `bson:"created_at" json:"created_at"`
}

// Gerçek Zamanlı Etki Analizi
type ImpactAnalysis struct {
	TotalCO2Saved         float64   `json:"totalCO2Saved"`
	TotalEnergyEquivalent float64   `json:"totalEnergyEquivalent"`
	TotalWaterSaved       float64   `json:"totalWaterSaved"`
	TreesEquivalent       float64   `json:"treesEquivalent"`
	CarsOffRoad           float64   `json:"carsOffRoad"`
	PhonesCharged         int       `json:"phonesCharged"`
	LightHoursTotal       float64   `json:"lightHoursTotal"`
	TotalWasteProcessed   int       `json:"totalWasteProcessed"`
	HighRiskWastes        int       `json:"highRiskWastes"`
	LastUpdated           time.Time `json:"lastUpdated"`
}

// --- INTERFACE'LER ---

type WasteRepository interface {
	Create(ctx context.Context, waste *Waste) error
	UpdateAnalysis(ctx context.Context, id primitive.ObjectID, analysis *AIAnalysisResult) error
	GetAllPoints(ctx context.Context) ([]*CollectionPoint, error)
	GetWastes(ctx context.Context) ([]*Waste, error)
	UpdateWasteStatus(ctx context.Context, id primitive.ObjectID, status string) error
	DeleteWaste(ctx context.Context, id primitive.ObjectID) error
	CreateRequest(ctx context.Context, req *CollectionRequest) error
	// Demo verisi oluşturmak için (Harita noktaları boş kalmasın diye)
	SeedPoints(ctx context.Context) error
	SeedWastes(ctx context.Context) error
	GetImpactStats(ctx context.Context) (*ImpactAnalysis, error)

	// --- YENİ EKLENEN METODLAR (NOKTA YÖNETİMİ) ---
	CreatePoint(ctx context.Context, point *CollectionPoint) error
	UpdatePoint(ctx context.Context, id primitive.ObjectID, point *CollectionPoint) error
	DeletePoint(ctx context.Context, id primitive.ObjectID) error
}

type WasteService interface {
	UploadAndAnalyze(ctx context.Context, userID string, fileHeader interface{}, description string) (*Waste, error)
	GetCollectionPoints(ctx context.Context) ([]*CollectionPoint, error)
	CreateCollectionRequest(ctx context.Context, userID, wasteID, pointID string) (*CollectionRequest, error)
	GetWastes(ctx context.Context) ([]*Waste, error)
	UpdateWasteStatus(ctx context.Context, wasteID, status string) error
	DeleteWaste(ctx context.Context, wasteID string) error

	// --- YENİ EKLENEN METODLAR (NOKTA YÖNETİMİ) ---
	CreatePoint(ctx context.Context, point *CollectionPoint) error
	UpdatePoint(ctx context.Context, pointID string, point *CollectionPoint) error
	DeletePoint(ctx context.Context, pointID string) error

	// --- GERÇEK ZAMANLI ETKİ ANALİZİ ---
	GetImpactAnalysis(ctx context.Context) (*ImpactAnalysis, error)
}
