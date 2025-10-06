// services/MissionService.ts
import { MissionData, MissionsApiResponse, MissionsData } from '../models/MissionModel';

// Configuración de la API desde variables de entorno
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://back.lda-orbita.earth/api/v1/';

class MissionService {
  /**
   * Obtiene las misiones espaciales con paginación usando cursor
   * @param cursor - Cursor para paginación (por defecto 0)
   * @param limit - Límite de elementos por página (por defecto 10)
   * @returns Promise con los datos de misiones paginados
   * @throws Error si la petición falla
   */
  async getMissions(cursor: number = 0, limit: number = 10): Promise<MissionsData> {
    try {
      const endpoint = `${API_BASE_URL}space_missions?cursor=${cursor}&limit=${limit}`;
      console.log('🔧 [MissionService] API URL:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [MissionService] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [MissionService] Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📦 [MissionService] Raw response (first 200 chars):', responseText.substring(0, 200));
      
      let apiResponse: MissionsApiResponse;
      try {
        apiResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ [MissionService] JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      console.log('📦 [MissionService] Parsed API Response:', {
        status: apiResponse.status,
        dataLength: apiResponse.data?.data?.length || 0,
        hasMore: apiResponse.data?.hasMore,
        nextCursor: apiResponse.data?.nextCursor,
        errors: apiResponse.errors
      });

      if (apiResponse.status !== 200) {
        throw new Error(`API Error: ${apiResponse.errors || 'Unknown error'}`);
      }

      if (!apiResponse.data || !Array.isArray(apiResponse.data.data)) {
        throw new Error('Invalid data structure in API response');
      }

      return apiResponse.data;
    } catch (error) {
      console.error('❌ [MissionService] Error fetching missions:', error);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Failed to fetch missions: ${error.message}`);
      } else {
        throw new Error('Failed to fetch missions: Unknown error');
      }
    }
  }

  /**
   * Obtiene las misiones espaciales de un planeta específico (filtradas por planet_code)
   * @param planetName - Nombre del planeta (ej: "Venus", "Mars", "Earth")
   * @returns Promise con el array de misiones del planeta
   * @throws Error si la petición falla
   */
  async getMissionsByPlanet(planetName: string): Promise<MissionData[]> {
    try {
      // Mapeo de nombres de planetas a códigos
      const planetCodeMap: { [key: string]: string } = {
        'Mercury': '199',
        'Venus': '299',
        'Earth': '399',
        'Mars': '499',
        'Jupiter': '599',
        'Saturn': '699',
        'Uranus': '799',
        'Neptune': '899',
        'Pluto': '999'
      };

      const planetCode = planetCodeMap[planetName];
      if (!planetCode) {
        console.warn(`⚠️ [MissionService] Unknown planet: ${planetName}`);
        return [];
      }

      // Obtener todas las misiones y filtrar por planeta
      const allMissions = await this.getAllMissions();
      return allMissions.filter(mission => mission.planet_code === planetCode);
    } catch (error) {
      console.error('❌ [MissionService] Error fetching missions by planet:', error);
      throw error;
    }
  }

  /**
   * Obtiene una misión específica por su ID
   * @param missionId - ID de la misión
   * @returns Promise con los datos de la misión
   */
  async getMissionById(missionId: string): Promise<MissionData | null> {
    try {
      const allMissions = await this.getAllMissions();
      return allMissions.find(m => m.id === missionId) || null;
    } catch (error) {
      console.error('❌ [MissionService] Error fetching mission by ID:', error);
      return null;
    }
  }

  /**
   * Obtiene todas las misiones disponibles usando paginación
   * @returns Promise con el array de todas las misiones
   */
  async getAllMissions(): Promise<MissionData[]> {
    try {
      let allMissions: MissionData[] = [];
      let cursor = 0;
      let hasMore = true;
      const limit = 50; // Cantidad de misiones por petición

      console.log('🚀 [MissionService] Iniciando carga de todas las misiones...');

      while (hasMore) {
        console.log(`📄 [MissionService] Cargando página cursor=${cursor}, limit=${limit}`);
        
        const page = await this.getMissions(cursor, limit);
        allMissions.push(...page.data);
        
        cursor = page.nextCursor;
        hasMore = page.hasMore;
        
        console.log(`✅ [MissionService] Página cargada: ${page.data.length} misiones, total acumulado: ${allMissions.length}`);
        
        // Prevenir bucle infinito en caso de error en la API
        if (cursor === 0 && hasMore) {
          console.warn('⚠️ [MissionService] Detectado posible bucle infinito, deteniendo carga');
          break;
        }
      }

      console.log(`🎉 [MissionService] Carga completa: ${allMissions.length} misiones en total`);
      return allMissions;
    } catch (error) {
      console.error('❌ [MissionService] Error fetching all missions:', error);
      throw error;
    }
  }

  /**
   * Obtiene misiones con control de paginación para vistas que requieren paginación incremental
   * @param cursor - Cursor para paginación
   * @param limit - Límite de elementos por página
   * @returns Promise con datos paginados de misiones
   */
  async getMissionsWithPagination(cursor: number = 0, limit: number = 10): Promise<MissionsData> {
    return this.getMissions(cursor, limit);
  }

  /**
   * Obtiene estadísticas generales de las misiones
   * @returns Promise con estadísticas de misiones
   */
  async getMissionStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    agencies: string[];
    missionTypes: string[];
  }> {
    try {
      const allMissions = await this.getAllMissions();
      
      const stats = {
        total: allMissions.length,
        active: allMissions.filter(m => m.status === 'active' || m.status === 'en_transito').length,
        completed: allMissions.filter(m => m.status === 'completed' || m.status === 'completado').length,
        agencies: [...new Set(allMissions.map(m => m.agency))],
        missionTypes: [...new Set(allMissions.map(m => m.mission_type))]
      };
      
      console.log('📊 [MissionService] Mission stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ [MissionService] Error getting mission stats:', error);
      throw error;
    }
  }
}

// Exportar instancia única (Singleton)
export default new MissionService();
