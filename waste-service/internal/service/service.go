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

	uploadDir := "C:/Users/canbay/Desktop/advancedKtu/waste-service/uploads"
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

	analysis, err := s.callAIService(fullPath, description)

	if err == nil {
		waste.AIAnalysis = analysis
		waste.Status = "analyzed"
	} else {
		fmt.Printf("AI Hatası: %v\n", err)
		waste.Status = "analysis_failed"
	}

	if err := s.repo.Create(ctx, waste); err != nil {
		return nil, err
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
