package http

import (
	"net/http"
	"waste-service/internal/domain"

	"github.com/labstack/echo/v4"
)

type WasteHandler struct {
	service domain.WasteService
}

func NewWasteHandler(service domain.WasteService) *WasteHandler {
	return &WasteHandler{service: service}
}

// 1. Dosya Yükleme Endpointi
func (h *WasteHandler) Upload(c echo.Context) error {
	c.Logger().Info("📤 [Handler] Upload endpoint çağrıldı")

	// Middleware'den userID'yi al (opsiyonel - oturum açmadan da çalışabilir)
	userID, ok := c.Get("userID").(string)
	if !ok || userID == "" {
		// Oturum açılmamışsa guest user olarak işle
		userID = "guest"
		c.Logger().Info("👤 [Handler] Guest kullanıcı olarak devam ediliyor")
	} else {
		c.Logger().Info("✅ [Handler] UserID alındı: ", userID)
	}

	description := c.FormValue("description")
	c.Logger().Info("📝 [Handler] Description: ", description)

	file, err := c.FormFile("image")
	if err != nil {
		c.Logger().Error("❌ [Handler] FormFile hatası: ", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error":  "Resim yüklemek zorunludur",
			"detail": err.Error(),
		})
	}

	c.Logger().Info("📁 [Handler] Dosya alındı:", map[string]interface{}{
		"filename": file.Filename,
		"size":     file.Size,
		"header":   file.Header,
	})

	c.Logger().Info("🔄 [Handler] Service.UploadAndAnalyze çağrılıyor...")
	waste, err := h.service.UploadAndAnalyze(c.Request().Context(), userID, file, description)
	if err != nil {
		c.Logger().Error("💥 [Handler] UploadAndAnalyze hatası: ", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
			"phase": "upload_and_analyze",
		})
	}

	c.Logger().Info("✅ [Handler] Upload başarılı, waste ID: ", waste.ID)
	return c.JSON(http.StatusCreated, waste)
}

// 2. Harita Noktalarını Getirme
func (h *WasteHandler) GetPoints(c echo.Context) error {
	points, err := h.service.GetCollectionPoints(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, points)
}

// 2b. Atıkları Getirme (Yeni)
func (h *WasteHandler) GetWastes(c echo.Context) error {
	wastes, err := h.service.GetWastes(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, wastes)
}

// 2c. Atık Durumunu Güncelle (Yeni)
type UpdateStatusPayload struct {
	Status string `json:"status"`
}

func (h *WasteHandler) UpdateWasteStatus(c echo.Context) error {
	id := c.Param("id")
	var payload UpdateStatusPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Geçersiz veri"})
	}

	if err := h.service.UpdateWasteStatus(c.Request().Context(), id, payload.Status); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Durum güncellendi"})
}

// 2d. Atık Sil (Yeni)
func (h *WasteHandler) DeleteWaste(c echo.Context) error {
	id := c.Param("id")

	if err := h.service.DeleteWaste(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Kayıt silindi"})
}

// 3. Talep Oluşturma
type RequestPayload struct {
	WasteID string `json:"waste_id"`
	PointID string `json:"point_id"`
}

func (h *WasteHandler) CreateRequest(c echo.Context) error {
	userID := c.Get("userID").(string)

	var payload RequestPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Eksik bilgi"})
	}

	req, err := h.service.CreateCollectionRequest(c.Request().Context(), userID, payload.WasteID, payload.PointID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, req)
}

// --- YENİ EKLENEN ENDPOINT'LER (NOKTA YÖNETİMİ) ---

// 4. Nokta Oluşturma
func (h *WasteHandler) CreatePoint(c echo.Context) error {
	var point domain.CollectionPoint
	if err := c.Bind(&point); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Geçersiz veri"})
	}

	if err := h.service.CreatePoint(c.Request().Context(), &point); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, point)
}

// 5. Nokta Güncelleme
func (h *WasteHandler) UpdatePoint(c echo.Context) error {
	id := c.Param("id")
	var point domain.CollectionPoint
	if err := c.Bind(&point); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Geçersiz veri"})
	}

	if err := h.service.UpdatePoint(c.Request().Context(), id, &point); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Nokta güncellendi"})
}

// 6. Nokta Silme
func (h *WasteHandler) DeletePoint(c echo.Context) error {
	id := c.Param("id")

	if err := h.service.DeletePoint(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Nokta silindi"})
}

// 7. Gerçek Zamanlı Etki Analizi
func (h *WasteHandler) GetImpactAnalysis(c echo.Context) error {
	impact, err := h.service.GetImpactAnalysis(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, impact)
}

// 8. Debug - Tüm atıkları detaylı göster (geliştirme için)
func (h *WasteHandler) GetWastesDebug(c echo.Context) error {
	wastes, err := h.service.GetWastes(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// Detaylı debug bilgisi
	response := map[string]interface{}{
		"total":  len(wastes),
		"wastes": wastes,
	}

	return c.JSON(http.StatusOK, response)
}

// 9. Çoklu Cihaz Bildirimi (3+ cihaz için açıklama tabanlı)
type MultipleDevicesPayload struct {
	Description    string  `json:"description"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	SubmissionDate string  `json:"submissionDate"`
}

func (h *WasteHandler) SubmitMultipleDevices(c echo.Context) error {
	c.Logger().Info("📦 [Handler] SubmitMultipleDevices endpoint çağrıldı")

	// Middleware'den userID'yi al (opsiyonel - oturum açmadan da çalışabilir)
	userID, ok := c.Get("userID").(string)
	if !ok || userID == "" {
		// Oturum açılmamışsa guest user olarak işle
		userID = "guest"
		c.Logger().Info("👤 [Handler] Guest kullanıcı olarak devam ediliyor")
	} else {
		c.Logger().Info("✅ [Handler] UserID alındı: ", userID)
	}

	var payload MultipleDevicesPayload
	if err := c.Bind(&payload); err != nil {
		c.Logger().Error("❌ [Handler] Payload bind hatası: ", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error":  "Geçersiz veri formatı",
			"detail": err.Error(),
		})
	}

	c.Logger().Info("📝 [Handler] Çoklu cihaz açıklaması:", payload.Description)
	c.Logger().Info("📍 [Handler] Konum:", map[string]interface{}{
		"latitude":  payload.Latitude,
		"longitude": payload.Longitude,
	})

	// Waste oluştur (image olmadan, sadece açıklama ve konum ile)
	waste := &domain.Waste{
		UserID:      userID,
		Description: payload.Description,
		Category:    "Çoklu Cihaz",
		Status:      "pending",
		ImagePath:   "",
		IsMultiple:  true, // Çoklu cihaz olduğunu işaretle
		Latitude:    payload.Latitude,
		Longitude:   payload.Longitude,
	}

	// Service üzerinden kaydet
	ctx := c.Request().Context()
	if err := h.service.CreateWaste(ctx, waste); err != nil {
		c.Logger().Error("💥 [Handler] Waste oluşturma hatası: ", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	c.Logger().Info("✅ [Handler] Çoklu cihaz kaydı başarılı, waste ID: ", waste.ID)
	return c.JSON(http.StatusCreated, waste)
}

// Rotaları Tanımla (GÜNCELLENDİ)
// NOT: /upload ve /points artık main.go'da public olarak tanımlı (auth gerektirmiyor)
func (h *WasteHandler) RegisterRoutes(e *echo.Group) {
	// e.POST("/upload", h.Upload)  // ❌ Bu satırı kaldırdık - main.go'da public
	// e.GET("/points", h.GetPoints) // ❌ Bu satırı kaldırdık - main.go'da public

	e.GET("/wastes", h.GetWastes)
	e.GET("/wastes/debug", h.GetWastesDebug)    // Debug endpoint
	e.PATCH("/wastes/:id", h.UpdateWasteStatus) // Atık durumunu güncelle
	e.DELETE("/wastes/:id", h.DeleteWaste)      // Atık sil
	e.POST("/requests", h.CreateRequest)

	e.POST("/points", h.CreatePoint)       // Nokta ekle
	e.PUT("/points/:id", h.UpdatePoint)    // Nokta güncelle
	e.DELETE("/points/:id", h.DeletePoint) // Nokta sil

	// NOT: /impact-analysis, /upload, /points main.go'da public olarak tanımlı
}
