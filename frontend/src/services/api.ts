// src/services/api.ts

import type { Device } from '../types/device';

const origin = (uri: string) => `${location.protocol}//${location.hostname}${uri}`;
const WASTE_API = origin(':8081/api');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const analyzeWasteImage = async (file: File) => {
  console.log('🔧 [API] analyzeWasteImage başladı');
  console.log('📁 [API] Dosya bilgileri:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });

  try {
    const token = localStorage.getItem('token');
    console.log('🔑 [API] Token kontrol:', token ? '✅ Mevcut' : '⚠️ Yok (guest olarak devam)');

    const formData = new FormData();
    formData.append('image', file);
    console.log('📦 [API] FormData oluşturuldu');

    const apiUrl = `${WASTE_API}/upload`;
    console.log('🌐 [API] İstek URL:', apiUrl);
    console.log('📤 [API] Fetch başlatılıyor...');

    const headers: HeadersInit = {};
    // Token varsa ekle, yoksa guest olarak devam et
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    console.log('📥 [API] Response alındı:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] Response başarısız:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`Servis Hatası (${response.status}): ${errorText}`);
    }

    const jsonData = await response.json();
    console.log('✅ [API] JSON parse başarılı:', jsonData);

    return jsonData;
  } catch (error: any) {
    console.error('💥 [API] KRITIK HATA:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      error: error
    });

    // Network hatası mı kontrol et
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('🌐 [API] Network hatası - Backend çalışmıyor olabilir!');
      throw new Error('Backend servisine bağlanılamadı. Lütfen servislerin çalıştığından emin olun.');
    }

    throw error;
  }
};

/**
 * Çoklu cihaz açıklamasını ve konumunu backend'e gönder
 * Dependency Inversion Principle: Interface üzerinden çalışır
 */
export const submitMultipleDevices = async (data: {
  description: string;
  latitude: number;
  longitude: number;
}): Promise<any> => {
  console.log('🔧 [API] submitMultipleDevices başladı');
  console.log('📋 [API] Payload:', data);

  try {
    const token = localStorage.getItem('token');
    console.log('🔑 [API] Token:', token ? '✅ Mevcut' : '⚠️ Yok (guest olarak devam)');

    const payload = {
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      submissionDate: new Date().toISOString(),
    };
    console.log('📦 [API] Gönderilecek payload:', payload);

    const apiUrl = `${WASTE_API}/devices/multiple`;
    console.log('🌐 [API] İstek URL:', apiUrl);

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Token varsa ekle, yoksa guest olarak devam et
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('📋 [API] Headers:', headers);

    console.log('📤 [API] Fetch başlatılıyor...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    console.log('📥 [API] Response alındı:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] Response başarısız:', errorText);
      throw new Error(`Çoklu cihaz gönderimi başarısız (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ [API] Başarılı response:', result);
    return result;
  } catch (error: any) {
    console.error('💥 [API] submitMultipleDevices hatası:', error);
    console.error('💥 [API] Hata detayı:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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
