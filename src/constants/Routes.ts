/**
 * Configuración de rutas para SpaceExplorer App
 * Este archivo centraliza todas las rutas de la aplicación para facilitar su mantenimiento
 */

export const AppRoutes = {
  // Rutas principales
  HOME: '/',
  TABS: '/(tabs)',
  
  // Rutas de pantallas
  SCREENS: {
    NASA_MISSIONS: '/screens/nasa-missions',
    EVENTS_PERU: '/screens/events-peru',
    SOLAR_SYSTEM: '/screens/solar-system',
    PLANETS: '/screens/planets',
    MISSIONS: '/screens/missions',
    EDUCATION: '/screens/education',
    IMAGE_GALLERY: '/screens/image-gallery'
  },
  
  // Rutas modales
  MODALS: {
    SETTINGS: '/modal'
  }
} as const;

/**
 * Función helper para obtener rutas de forma type-safe
 */
export const getRoute = (routePath: string): string => {
  return routePath;
};

/**
 * Configuración de títulos de pantallas
 */
export const ScreenTitles = {
  NASA_MISSIONS: 'Misiones NASA',
  EVENTS_PERU: 'Eventos en Perú',
  SOLAR_SYSTEM: 'Sistema Solar',
  PLANETS: 'Planetas',
  EDUCATION: 'Contenido Educativo',
  HOME: 'SpaceExplorer'
} as const;