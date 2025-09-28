import { useCallback, useState } from 'react';
import { MenuOption, NavigationModel } from '../models/NavigationModel';
import { NavigationService } from '../services/NavigationService';

export const useWelcomeViewModel = () => {
  const [menuOptions] = useState<MenuOption[]>(NavigationModel.getMenuOptions());
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = useCallback((route: string, navigation: any) => {
    NavigationService.navigateWithFeedback(route, navigation, {
      onStart: () => setIsLoading(true),
      onComplete: () => setIsLoading(false),
      delay: 300
    });
  }, []);

  return {
    menuOptions,
    isLoading,
    handleNavigation
  };
};