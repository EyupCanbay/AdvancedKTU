// src/services/api.ts

const WASTE_API = 'http://localhost:8081/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const analyzeWasteImage = async (file: File) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${WASTE_API}/upload`, { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` 
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Servis Hatası: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Entegrasyon Hatası:", error);
    throw error;
  }
};

// Harita noktalarını getir
export const getCollectionPoints = async () => {
  try {
    const response = await fetch(`${WASTE_API}/points`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Noktalar alınamadı');
    }

    return await response.json();
  } catch (error) {
    console.error('Collection Points Error:', error);
    throw error;
  }
};

// Teslimat talebi oluştur
export const createCollectionRequest = async (wasteID: string, pointID: string) => {
  try {
    const response = await fetch(`${WASTE_API}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        waste_id: wasteID,
        point_id: pointID
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request oluşturulamadı: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create Request Error:', error);
    throw error;
  }
};