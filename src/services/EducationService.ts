// services/EducationService.ts
import { EducationApiResponse, EducationContent, EducationData } from '../models/EducationModel';

// Configuración de la API desde variables de entorno
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://back.lda-orbita.earth/api/v1/';
const API_EDUCATION_ENDPOINT = `${API_BASE_URL}education-content`;

class EducationService {
  /**
   * Obtiene contenido educativo con paginación
   * @param cursor - Cursor para paginación (por defecto 0)
   * @param limit - Límite de elementos por página (por defecto 10)
   * @returns Promise con el contenido educativo
   * @throws Error si la petición falla
   */
  async getEducationContent(cursor: number = 0, limit: number = 10): Promise<EducationData> {
    try {
      const url = `${API_EDUCATION_ENDPOINT}?cursor=${cursor}&limit=${limit}`;
      console.log('🔧 [EducationService] API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [EducationService] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [EducationService] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EducationApiResponse = await response.json();
      console.log('✅ [EducationService] Data received:', data.data.data.data.length, 'items');

      return data.data.data;
    } catch (error) {
      console.error('❌ [EducationService] Error:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Error de red: Verifica tu conexión a internet');
      }
      throw error;
    }
  }

  /**
   * Obtiene contenido educativo filtrado por planeta
   * @param planetCode - Código del planeta (ej: "199" para Mercury)
   * @returns Promise con el contenido educativo del planeta
   */
  async getEducationByPlanet(planetCode: string): Promise<EducationContent[]> {
    try {
      const data = await this.getEducationContent(0, 100); // Obtener más elementos para filtrar
      return data.data.filter(item => item.planet_code === planetCode);
    } catch (error) {
      console.error('❌ [EducationService] Error filtering by planet:', error);
      throw error;
    }
  }

  /**
   * Obtiene contenido educativo filtrado por tipo
   * @param type - Tipo de contenido ('guide' | 'interactive')
   * @returns Promise con el contenido educativo del tipo especificado
   */
  async getEducationByType(type: 'guide' | 'interactive'): Promise<EducationContent[]> {
    try {
      const data = await this.getEducationContent(0, 100);
      return data.data.filter(item => item.type === type);
    } catch (error) {
      console.error('❌ [EducationService] Error filtering by type:', error);
      throw error;
    }
  }
}

export default new EducationService();