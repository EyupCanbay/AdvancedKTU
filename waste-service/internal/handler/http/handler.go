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
	// Middleware'den userID'yi al
	userID := c.Get("userID").(string)

	description := c.FormValue("description")
	file, err := c.FormFile("image")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Resim yüklemek zorunludur"})
	}

	waste, err := h.service.UploadAndAnalyze(c.Request().Context(), userID, file, description)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

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

// Rotaları Tanımla (GÜNCELLENDİ)
func (h *WasteHandler) RegisterRoutes(e *echo.Group) {
	e.POST("/upload", h.Upload)
	e.GET("/points", h.GetPoints)
	e.POST("/requests", h.CreateRequest)

	e.POST("/points", h.CreatePoint)       // Nokta ekle
	e.PUT("/points/:id", h.UpdatePoint)    // Nokta güncelle
	e.DELETE("/points/:id", h.DeletePoint) // Nokta sil
}