// models/MissionEducationModel.ts

export interface MissionEducationContent {
  planet_code: string;
  id: string;
  type: 'guide' | 'interactive';
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  topics: string[];
  description: string;
  key_points?: string[];
  safety?: string[];
  activity_type?: string;
  steps?: string[];
}

export interface MissionEducationData {
  data: MissionEducationContent[];
  nextCursor: number;
  hasMore: boolean;
}

export interface MissionEducationApiResponse {
  status: number;
  data: {
    data: MissionEducationData;
  };
  errors: any;
  timestamp: string;
}

// Mapeo de códigos de planetas a nombres
export const PlanetCodeMap: { [key: string]: string } = {
  '199': 'Mercurio',
  '299': 'Venus',
  '399': 'Tierra',
  '499': 'Marte',
  '599': 'Júpiter',
  '699': 'Saturno',
  '799': 'Urano',
  '899': 'Neptuno',
  '999': 'Plutón',
};

// Mapeo de dificultad a colores
export const DifficultyColors = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
};

// Mapeo de tipos a iconos/colores
export const TypeColors = {
  guide: '#2196F3',
  interactive: '#9C27B0',
};