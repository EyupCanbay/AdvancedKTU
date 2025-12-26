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

// Rotaları Tanımla
func (h *WasteHandler) RegisterRoutes(e *echo.Group) {
	e.POST("/upload", h.Upload)
	e.GET("/points", h.GetPoints)
	e.POST("/requests", h.CreateRequest)
}