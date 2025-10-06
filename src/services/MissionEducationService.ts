// services/MissionEducationService.ts
import { MissionEducationApiResponse, MissionEducationContent, MissionEducationData } from '../models/MissionEducationModel';

// Configuración de la API desde variables de entorno
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://back.lda-orbita.earth/api/v1/';
const API_EDUCATION_ENDPOINT = `${API_BASE_URL}education-content`;

class MissionEducationService {
  /**
   * Obtiene contenido educativo de misiones con paginación
   * @param cursor - Cursor para paginación (por defecto 0)
   * @param limit - Límite de elementos por página (por defecto 10)
   * @returns Promise con el contenido educativo de misiones
   * @throws Error si la petición falla
   */
  async getMissionEducationContent(cursor: number = 0, limit: number = 10): Promise<MissionEducationData> {
    try {
      const url = `${API_EDUCATION_ENDPOINT}?cursor=${cursor}&limit=${limit}`;
      console.log('🔧 [MissionEducationService] API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [MissionEducationService] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [MissionEducationService] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: MissionEducationApiResponse = await response.json();
      console.log('✅ [MissionEducationService] Data received:', data.data.data.data.length, 'items');

      return data.data.data;
    } catch (error) {
      console.error('❌ [MissionEducationService] Error:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Error de red: Verifica tu conexión a internet');
      }
      throw error;
    }
  }

  /**
   * Obtiene contenido educativo filtrado por planeta
   * @param planetCode - Código del planeta (ej: "199" para Mercurio)
   * @returns Promise con el contenido educativo del planeta
   */
  async getMissionEducationByPlanet(planetCode: string): Promise<MissionEducationContent[]> {
    try {
      const data = await this.getMissionEducationContent(0, 100); // Obtener más elementos para filtrar
      return data.data.filter(item => item.planet_code === planetCode);
    } catch (error) {
      console.error('❌ [MissionEducationService] Error filtering by planet:', error);
      throw error;
    }
  }

  /**
   * Obtiene contenido educativo filtrado por tipo
   * @param type - Tipo de contenido ('guide' | 'interactive')
   * @returns Promise con el contenido educativo del tipo especificado
   */
  async getMissionEducationByType(type: 'guide' | 'interactive'): Promise<MissionEducationContent[]> {
    try {
      const data = await this.getMissionEducationContent(0, 100);
      return data.data.filter(item => item.type === type);
    } catch (error) {
      console.error('❌ [MissionEducationService] Error filtering by type:', error);
      throw error;
    }
  }
}

export default new MissionEducationService();