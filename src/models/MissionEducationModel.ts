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

// Sistema de niveles y experiencia
export interface UserProgress {
  level: number;
  experiencePoints: number;
  totalContentCompleted: number;
  streak: number; // días consecutivos
}

export interface LevelInfo {
  level: number;
  title: string;
  minExperience: number;
  maxExperience: number;
  badge: string;
  color: string;
}

// Configuración de niveles
export const LEVELS_CONFIG: LevelInfo[] = [
  { level: 1, title: "Explorador Novato", minExperience: 0, maxExperience: 100, badge: "🌟", color: "#4CAF50" },
  { level: 2, title: "Observador Estelar", minExperience: 101, maxExperience: 250, badge: "🔭", color: "#2196F3" },
  { level: 3, title: "Cazador de Planetas", minExperience: 251, maxExperience: 500, badge: "🪐", color: "#9C27B0" },
  { level: 4, title: "Astronauta Virtual", minExperience: 501, maxExperience: 1000, badge: "🚀", color: "#FF5722" },
  { level: 5, title: "Maestro del Cosmos", minExperience: 1001, maxExperience: 2000, badge: "🌌", color: "#FF9800" },
  { level: 6, title: "Científico Espacial", minExperience: 2001, maxExperience: 5000, badge: "👨‍🚀", color: "#795548" },
  { level: 7, title: "Explorador Galáctico", minExperience: 5001, maxExperience: 10000, badge: "🌠", color: "#E91E63" },
  { level: 8, title: "Guardián de las Estrellas", minExperience: 10001, maxExperience: 999999, badge: "⭐", color: "#FFD700" },
];

// Puntos de experiencia por actividad
export const EXPERIENCE_REWARDS = {
  guide_completed: 15,
  interactive_completed: 25,
  daily_streak: 10,
  first_time_planet: 30,
};

// Mapeo de tipos a iconos/colores
export const TypeColors = {
  guide: '#2196F3',
  interactive: '#9C27B0',
};