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
      {
        id: '1',
        title: ScreenTitles.PLANETS,
        description: 'Información de planetas',
        icon: '🪐',
        route: AppRoutes.SCREENS.PLANETS
      },
      {
        id: '2',
        title: 'Misiones Planetarias',
        description: 'Guías de observación y misiones',
        icon: '�',
        route: AppRoutes.SCREENS.MISSIONS
      },
      {
        id: '3',
        title: ScreenTitles.EDUCATION,
        description: 'Contenido educativo para estudiantes',
        icon: '�',
        route: AppRoutes.SCREENS.EDUCATION
      }
    ];
  }
}