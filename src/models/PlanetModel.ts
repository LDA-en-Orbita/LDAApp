// models/PlanetModel.ts
export interface PlanetName {
  es: string;
  en: string;
}

export interface PlanetAttribute {
  name: PlanetName;
  raw_value?: string;
  value: string;
  unit?: string;
}

export interface PlanetData {
  command: string;
  target_name: string;
  target_name_es?: string;
  attributes: PlanetAttribute[];
}

// Respuesta de la API
export interface PlanetsApiResponse {
  status: number;
  data: {
    data: PlanetData[];
  };
  errors: null | string;
  timestamp: string;
}

// Para el modo local (array)
export interface LocalPlanetData extends PlanetData {
  id?: string;
}