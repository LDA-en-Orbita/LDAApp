// services/PlanetService.ts
import { PlanetData, LocalPlanetData } from '../models/PlanetModel';

class PlanetService {
  private baseURL: string = 'https://tu-api.com/planets'; // Reemplaza con tu URL

  // Método para consumir el servicio API
  async fetchPlanetData(planetName?: string): Promise<PlanetData> {
    try {
      const endpoint = planetName 
        ? `${this.baseURL}/${planetName}`
        : this.baseURL;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: PlanetData = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching planet data:', error);
      throw error;
    }
  }

  // Método para consumir datos locales (array)
  getLocalPlanetData(planets: LocalPlanetData[], planetName?: string): PlanetData | null {
    if (planetName) {
      return planets.find(planet => 
        planet.target_name.toLowerCase() === planetName.toLowerCase()
      ) || null;
    }
    
    // Si no se especifica planeta, retornar el primero o null
    return planets.length > 0 ? planets[0] : null;
  }

  // Método que decide automáticamente qué fuente usar
  async getPlanetData(
    useService: boolean, 
    localData?: LocalPlanetData[], 
    planetName?: string
  ): Promise<PlanetData | null> {
    if (useService) {
      return await this.fetchPlanetData(planetName);
    } else if (localData) {
      return this.getLocalPlanetData(localData, planetName);
    }
    
    return null;
  }
}

export default new PlanetService();