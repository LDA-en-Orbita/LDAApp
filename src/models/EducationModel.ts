// models/EducationModel.ts

export interface EducationContent {
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

export interface EducationData {
  data: EducationContent[];
  nextCursor: number;
  hasMore: boolean;
}

export interface EducationApiResponse {
  status: number;
  data: {
    data: EducationData;
  };
  errors: any;
  timestamp: string;
}

// Mapeo de códigos de planetas a nombres
export const PlanetCodeMap: { [key: string]: string } = {
  '199': 'Mercury',
  '299': 'Venus',
  '399': 'Earth',
  '499': 'Mars',
  '599': 'Jupiter',
  '699': 'Saturn',
  '799': 'Uranus',
  '899': 'Neptune',
  '999': 'Pluto',
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