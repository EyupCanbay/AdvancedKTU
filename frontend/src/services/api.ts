// src/services/api.ts
export const analyzeWasteImage = async (file: File) => {
  try {
    const token = localStorage.getItem('token'); // Giriş yapan kullanıcının token'ını alıyoruz
    const formData = new FormData();
    formData.append('image', file);

    // URL'e /api ekledik ve 8081 portuna yönlendirdik
    const response = await fetch('http://localhost:8081/api/upload', { 
      method: 'POST',
      headers: {
        // AuthGuard'ın geçmesi için token göndermek zorunlu
        'Authorization': `Bearer ${token}` 
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Servis Hatası: ${errorText}`);
    }
    
    return await response.json(); // Backend'den gelen Waste objesini döner
  } catch (error) {
    console.error("Entegrasyon Hatası:", error);
    throw error;
  }
};