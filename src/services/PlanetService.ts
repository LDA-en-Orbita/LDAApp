// services/PlanetService.ts
import { PlanetData, PlanetsApiResponse } from '../models/PlanetModel';

const API_URL = 'https://back.lda-orbita.earth/api/v1/planets';

class PlanetService {
  /**
   * Obtiene la lista completa de planetas desde la API
   * @returns Promise con el array de planetas
   * @throws Error si la petición falla
   */
  async getAllPlanets(): Promise<PlanetData[]> {
    try {
      console.log('🚀 [PlanetService] Iniciando fetch a:', API_URL);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [PlanetService] Response status:', response.status);
      console.log('📡 [PlanetService] Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlanetsApiResponse = await response.json();
      console.log('📦 [PlanetService] Data recibida:', {
        status: data.status,
        planetsCount: data.data?.data?.length || 0
      });

      if (data.status === 200 && data.data && data.data.data) {
        console.log('✅ [PlanetService] Planetas cargados exitosamente:', data.data.data.length);
        return data.data.data;
      } else {
        throw new Error('Respuesta de API inválida');
      }
    } catch (error) {
      console.error('❌ [PlanetService] Error completo:', error);
      console.error('❌ [PlanetService] Error tipo:', typeof error);
      console.error('❌ [PlanetService] Error mensaje:', error instanceof Error ? error.message : String(error));
      
      throw error;
    }
  }

  /**
   * Obtiene un planeta específico por su nombre
   * @param planetName Nombre del planeta (en inglés o español)
   * @returns Promise con los datos del planeta o undefined si no se encuentra
   */
  async getPlanetByName(planetName: string): Promise<PlanetData | undefined> {
    const planets = await this.getAllPlanets();
    return planets.find(
      planet => planet.target_name.toLowerCase() === planetName.toLowerCase() ||
                planet.target_name_es?.toLowerCase() === planetName.toLowerCase()
    );
  }

  /**
   * Obtiene un planeta específico por su comando
   * @param command Comando del planeta (ej: '399' para Earth)
   * @returns Promise con los datos del planeta o undefined si no se encuentra
   */
  async getPlanetByCommand(command: string): Promise<PlanetData | undefined> {
    const planets = await this.getAllPlanets();
    return planets.find(planet => planet.command === command);
  }
}

export default new PlanetService();