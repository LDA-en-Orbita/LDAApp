/**
 * Servicio de navegación centralizado
 * Maneja todas las operaciones de navegación de la aplicación
 */
export class NavigationService {
  
  /**
   * Navega a una ruta específica con feedback visual
   * @param route Ruta de destino
   * @param router Instancia del router de Expo
   * @param options Opciones adicionales de navegación
   */
  static navigateWithFeedback(
    route: string, 
    router: any, 
    options?: { 
      delay?: number; 
      onStart?: () => void; 
      onComplete?: () => void 
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      const { delay = 300, onStart, onComplete } = options || {};
      
      // Ejecutar callback de inicio
      if (onStart) onStart();
      
      // Aplicar delay para feedback visual
      setTimeout(() => {
        router.push(route);
        if (onComplete) onComplete();
        resolve();
      }, delay);
    });
  }

  /**
   * Navega hacia atrás en la pila de navegación
   * @param router Instancia del router de Expo
   */
  static goBack(router: any): void {
    if (router.canGoBack()) {
      router.back();
    }
  }

  /**
   * Reemplaza la ruta actual con una nueva
   * @param route Nueva ruta
   * @param router Instancia del router de Expo
   */
  static replace(route: string, router: any): void {
    router.replace(route);
  }

  /**
   * Resetea la pila de navegación y navega a una nueva ruta
   * @param route Nueva ruta
   * @param router Instancia del router de Expo
   */
  static reset(route: string, router: any): void {
    router.dismissAll();
    router.replace(route);
  }
}