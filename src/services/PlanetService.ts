// services/PlanetService.ts
import { PlanetData, PlanetsApiResponse } from '../models/PlanetModel';

// Configuración de la API desde variables de entorno
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PLANETS_ENDPOINT = `${API_BASE_URL}planets`;

class PlanetService {
  /**
   * Obtiene la lista completa de planetas desde la API
   * @returns Promise con el array de planetas
   * @throws Error si la petición falla
   */
  async getAllPlanets(): Promise<PlanetData[]> {
    try {
      console.log('🔧 [PlanetService] API URL:', API_PLANETS_ENDPOINT);
      
      const response = await fetch(API_PLANETS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🌐 [PlanetService] Respuesta cruda:', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlanetsApiResponse = await response.json();

      if (data.status === 200 && data.data && data.data.data) {
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