// services/ImageGalleryService.ts
import { ImageGalleryApiResponse, ImageGalleryData, ImageItem } from '../models/ImageGalleryModel';

// Configuración de la API desde variables de entorno
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://back.lda-orbita.earth/api/v1/';

class ImageGalleryService {
  /**
   * Obtiene la galería de imágenes de un planeta específico
   * @param planetName - Nombre del planeta en español (ej: "marte", "venus")
   * @param type - Tipo de contenido (por defecto "planets")
   * @param nasaIds - IDs específicos de NASA (opcional)
   * @param keyword - Palabra clave para filtrar (opcional)
   * @returns Promise con los datos de la galería
   * @throws Error si la petición falla
   */
  async getImagesByPlanet(
    planetName: string,
    type: string = 'planets',
    nasaIds: string = '',
    keyword: string = ''
  ): Promise<ImageGalleryData> {
    try {
      const url = `${API_BASE_URL}files/${planetName}?type=${type}&nasaIds=${nasaIds}&keyword=${keyword}`;
      console.log('🔧 [ImageGalleryService] API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [ImageGalleryService] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ImageGalleryService] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ImageGalleryApiResponse = await response.json();
      console.log('✅ [ImageGalleryService] Images received:', data.data.data.items.length, 'items');

      return data.data.data;
    } catch (error) {
      console.error('❌ [ImageGalleryService] Error:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Error de red: Verifica tu conexión a internet');
      }
      throw error;
    }
  }

  /**
   * Obtiene imágenes filtradas por grupo de misión
   * @param planetName - Nombre del planeta
   * @param groupKey - Clave del grupo de misión (ej: "mars_mars_exploration_rover_mer")
   * @returns Promise con las imágenes filtradas
   */
  async getImagesByGroup(planetName: string, groupKey: string): Promise<ImageItem[]> {
    try {
      const data = await this.getImagesByPlanet(planetName);
      return data.items.filter(item => 
        item.keywords.some(keyword => 
          groupKey.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '_'))
        )
      );
    } catch (error) {
      console.error('❌ [ImageGalleryService] Error filtering by group:', error);
      throw error;
    }
  }

  /**
   * Obtiene imágenes filtradas por palabra clave
   * @param planetName - Nombre del planeta
   * @param keyword - Palabra clave para buscar
   * @returns Promise con las imágenes filtradas
   */
  async getImagesByKeyword(planetName: string, keyword: string): Promise<ImageGalleryData> {
    try {
      return await this.getImagesByPlanet(planetName, 'planets', '', keyword);
    } catch (error) {
      console.error('❌ [ImageGalleryService] Error filtering by keyword:', error);
      throw error;
    }
  }
}

export default new ImageGalleryService();