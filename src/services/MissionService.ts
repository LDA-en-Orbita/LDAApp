// services/MissionService.ts
import { MissionData, MissionsApiResponse } from '../models/MissionModel';

// Configuración de la API desde variables de entorno
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://back.lda-orbita.earth/api/v1/';

class MissionService {
  /**
   * Obtiene las misiones espaciales de un planeta específico
   * @param planetName - Nombre del planeta (ej: "Venus", "Mars", "Earth")
   * @returns Promise con el array de misiones
   * @throws Error si la petición falla
   */
  async getMissionsByPlanet(planetName: string): Promise<MissionData[]> {
    try {
      const endpoint = `${API_BASE_URL}space_missions/${planetName}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: MissionsApiResponse = await response.json();
      if (apiResponse.status !== 200) {
        throw new Error(`API Error: ${apiResponse.errors || 'Unknown error'}`);
      }

      return apiResponse.data.data;
    } catch (error) {
      console.error('❌ [MissionService] Error fetching missions:', error);
      throw error;
    }
  }

  /**
   * Obtiene una misión específica por su ID
   * @param missionId - ID de la misión
   * @param planetName - Nombre del planeta
   * @returns Promise con los datos de la misión
   */
  async getMissionById(missionId: string, planetName: string): Promise<MissionData | null> {
    try {
      const missions = await this.getMissionsByPlanet(planetName);
      return missions.find(m => m.id === missionId) || null;
    } catch (error) {
      console.error('❌ [MissionService] Error fetching mission by ID:', error);

      return null;
    }
  }

  /**
   * Obtiene todas las misiones de todos los planetas
   * @returns Promise con el array de todas las misiones
   */
  async getAllMissions(): Promise<MissionData[]> {
    try {
      const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      const allMissions: MissionData[] = [];

      for (const planet of planets) {
        try {
          const missions = await this.getMissionsByPlanet(planet);
          allMissions.push(...missions);
        } catch (error) {
          console.warn(`⚠️ [MissionService] No missions found for ${planet}`);
        }
      }

      return allMissions;
    } catch (error) {
      console.error('❌ [MissionService] Error fetching all missions:', error);
      throw error;
    }
  }
}

// Exportar instancia única (Singleton)
export default new MissionService();
