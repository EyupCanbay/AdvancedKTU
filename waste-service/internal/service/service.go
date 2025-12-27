package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings" // URL birleştirme için eklendi
	"time"
	"waste-service/internal/domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type wasteService struct {
	repo  domain.WasteRepository
	aiURL string
}

func NewWasteService(repo domain.WasteRepository, aiURL string) domain.WasteService {
	cleanURL := strings.TrimRight(aiURL, "/")
	return &wasteService{repo: repo, aiURL: cleanURL}
}

func (s *wasteService) UploadAndAnalyze(ctx context.Context, userID string, fileHeader interface{}, description string) (*domain.Waste, error) {
	fh := fileHeader.(*multipart.FileHeader)

	wd, _ := os.Getwd()
	fmt.Println("Çalışma Dizini:", wd)

	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return nil, fmt.Errorf("klasör oluşturulamadı: %v", err)
	}

	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), fh.Filename)
	fullPath := filepath.Join(uploadDir, filename)

	src, err := fh.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	dst, err := os.Create(fullPath)
	if err != nil {
		return nil, fmt.Errorf("dosya oluşturulamadı (%s): %v", fullPath, err)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return nil, err
	}

	waste := &domain.Waste{
		UserID:      userID,
		ImagePath:   fullPath,
		Description: description,
		Status:      "analyzing",
	}

	// Veritabanına kaydet (analyzing durumunda)
	if err := s.repo.Create(ctx, waste); err != nil {
		return nil, err
	}

	// AI servisini çağır
	analysis, err := s.callAIService(fullPath, description)

	if err == nil {
		// AI analizi başarılı ise veritabanını güncelle
		if err := s.repo.UpdateAnalysis(ctx, waste.ID, analysis); err != nil {
			fmt.Printf("Analiz Kaydı Hatası: %v\n", err)
		} else {
			waste.AIAnalysis = analysis
			waste.Status = "analyzed"
		}
	} else {
		// AI analizi başarısız ise durumu güncelle
		fmt.Printf("AI Hatası: %v\n", err)
		waste.Status = "analysis_failed"
	}

	return waste, nil
}

func (s *wasteService) callAIService(imagePath, description string) (*domain.AIAnalysisResult, error) {

	payload := map[string]string{
		"image_path":  imagePath,
		"description": description,
	}
	jsonPayload, _ := json.Marshal(payload)

	targetURL := fmt.Sprintf("%s", s.aiURL)

	fmt.Println("📡 AI İsteği Gönderiliyor:", targetURL)

	resp, err := http.Post(targetURL, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("AI servisi hata döndü (%d): %s", resp.StatusCode, string(bodyBytes))
	}

	type AIResponseWrapper struct {
		Success bool                    `json:"success"`
		Data    domain.AIAnalysisResult `json:"data"`
	}

	var wrapper AIResponseWrapper
	if err := json.NewDecoder(resp.Body).Decode(&wrapper); err != nil {
		return nil, fmt.Errorf("JSON decode hatası: %v", err)
	}

	if !wrapper.Success {
		return nil, fmt.Errorf("AI servisi success:false döndü")
	}

	return &wrapper.Data, nil
}

func (s *wasteService) GetCollectionPoints(ctx context.Context) ([]*domain.CollectionPoint, error) {
	return s.repo.GetAllPoints(ctx)
}

func (s *wasteService) GetWastes(ctx context.Context) ([]*domain.Waste, error) {
	return s.repo.GetWastes(ctx)
}

func (s *wasteService) UpdateWasteStatus(ctx context.Context, wasteID, status string) error {
	objID, err := primitive.ObjectIDFromHex(wasteID)
	if err != nil {
		return fmt.Errorf("geçersiz waste ID formatı")
	}
	return s.repo.UpdateWasteStatus(ctx, objID, status)
}

func (s *wasteService) DeleteWaste(ctx context.Context, wasteID string) error {
	objID, err := primitive.ObjectIDFromHex(wasteID)
	if err != nil {
		return fmt.Errorf("geçersiz waste ID formatı")
	}
	return s.repo.DeleteWaste(ctx, objID)
}

// CreateWaste - Çoklu cihaz için waste oluştur (resim olmadan)
func (s *wasteService) CreateWaste(ctx context.Context, waste *domain.Waste) error {
	waste.CreatedAt = time.Now()
	return s.repo.Create(ctx, waste)
}

func (s *wasteService) CreateCollectionRequest(ctx context.Context, userID, wasteID, pointID string) (*domain.CollectionRequest, error) {
	wID, _ := primitive.ObjectIDFromHex(wasteID)
	pID, _ := primitive.ObjectIDFromHex(pointID)

	req := &domain.CollectionRequest{
		UserID:            userID,
		WasteID:           wID,
		CollectionPointID: pID,
		Status:            "created",
	}
	err := s.repo.CreateRequest(ctx, req)
	return req, err
}

// --- YENİ EKLENEN METODLAR (NOKTA YÖNETİMİ) ---

func (s *wasteService) CreatePoint(ctx context.Context, point *domain.CollectionPoint) error {
	return s.repo.CreatePoint(ctx, point)
}

func (s *wasteService) UpdatePoint(ctx context.Context, pointID string, point *domain.CollectionPoint) error {
	objID, err := primitive.ObjectIDFromHex(pointID)
	if err != nil {
		return fmt.Errorf("geçersiz ID formatı")
	}
	return s.repo.UpdatePoint(ctx, objID, point)
}

func (s *wasteService) DeletePoint(ctx context.Context, pointID string) error {
	objID, err := primitive.ObjectIDFromHex(pointID)
	if err != nil {
		return fmt.Errorf("geçersiz ID formatı")
	}
	return s.repo.DeletePoint(ctx, objID)
}

// --- GERÇEK ZAMANLI ETKİ ANALİZİ ---

func (s *wasteService) GetImpactAnalysis(ctx context.Context) (*domain.ImpactAnalysis, error) {
	return s.repo.GetImpactStats(ctx)
}
