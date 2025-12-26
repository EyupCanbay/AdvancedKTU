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
	"time"
	"waste-service/internal/domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type wasteService struct {
	repo  domain.WasteRepository
	aiURL string
}

func NewWasteService(repo domain.WasteRepository, aiURL string) domain.WasteService {
	return &wasteService{repo: repo, aiURL: aiURL}
}
func (s *wasteService) UploadAndAnalyze(ctx context.Context, userID string, fileHeader interface{}, description string) (*domain.Waste, error) {
	fh := fileHeader.(*multipart.FileHeader)

	// --- BURAYI GÜNCELLE ---

	// 1. Çalışma dizinini al (Debug için)
	wd, _ := os.Getwd()
	fmt.Println("Çalışma Dizini:", wd)

	// 2. Klasörü Garantiye Al
	uploadDir := "C:/Users/canbay/Desktop/advancedKtu/waste-service/uploads" // Sadece "uploads" olsun, başına proje adı koyma
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return nil, fmt.Errorf("klasör oluşturulamadı: %v", err)
	}

	// 3. Dosya Yolunu Oluştur
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), fh.Filename)
	fullPath := filepath.Join(uploadDir, filename)

	// 4. Dosyayı Aç ve Kopyala
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

	// 2. WASTE OBJESİNİ HAZIRLA
	waste := &domain.Waste{
		UserID:      userID,
		ImagePath:   fullPath,
		Description: description,
		Status:      "analyzing", // Önce analiz ediliyor diyoruz
	}

	// 3. AI SERVİSİNE İSTEK AT VE BEKLE (SENKRON)
	// Kullanıcı loading ekranında bekleyecek ama sonuçla dönecek.
	analysis, err := s.callAIService(fullPath, description)

	if err == nil {
		// AI Başarılıysa sonucu ekle
		waste.AIAnalysis = analysis
		waste.Status = "analyzed"
	} else {
		// AI Hata verdiyse bile kaydı oluştur ama status farklı olsun
		fmt.Printf("AI Hatası: %v\n", err)
		waste.Status = "analysis_failed"
	}

	// 4. VERİTABANINA KAYDET (AI Sonucuyla birlikte)
	if err := s.repo.Create(ctx, waste); err != nil {
		return nil, err
	}

	// 5. CLIENT'A FULL OBJEYİ DÖN
	return waste, nil
}

// AI İsteğini atan fonksiyon (Description eklendi)
func (s *wasteService) callAIService(imagePath, description string) (*domain.AIAnalysisResult, error) {
	// AI Servisi bizden ne bekliyorsa onu gönderiyoruz
	payload := map[string]string{
		"image_path":  imagePath,   // Resmin yolu
		"description": description, // Kullanıcının girdiği açıklama
	}
	jsonPayload, _ := json.Marshal(payload)

	// AI Servisine POST isteği
	resp, err := http.Post(s.aiURL, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("AI servisi hata döndü: %d", resp.StatusCode)
	}

	var result domain.AIAnalysisResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
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
