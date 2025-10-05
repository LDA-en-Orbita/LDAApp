import { AppRoutes, ScreenTitles } from '../constants/Routes';

export interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

export class NavigationModel {
  static getMenuOptions(): MenuOption[] {
    return [
      // {
      //   id: '1',
      //   title: ScreenTitles.NASA_MISSIONS,
      //   description: 'Explora las misiones espaciales',
      //   icon: '🚀',
      //   route: AppRoutes.SCREENS.NASA_MISSIONS
      // },
      // {
      //   id: '2',
      //   title: ScreenTitles.EVENTS_PERU,
      //   description: 'Eventos astronómicos visibles',
      //   icon: '🌟',
      //   route: AppRoutes.SCREENS.EVENTS_PERU
      // },
      // {
      //   id: '3',
      //   title: ScreenTitles.SOLAR_SYSTEM,
      //   description: 'Descubre nuestro sistema',
      //   icon: '🪐',
      //   route: AppRoutes.SCREENS.SOLAR_SYSTEM
      // },
      {
        id: '4',
        title: ScreenTitles.PLANETS,
        description: 'Información de planetas',
        icon: '🪐',
        route: AppRoutes.SCREENS.PLANETS
      }
    ];
  }
}