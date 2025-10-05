// models/PlanetModel.ts
export interface PlanetName {
  es: string;
  en: string;
}

export interface PlanetAttribute {
  key: string;
  name: PlanetName;
  value: string;
}

export interface PlanetData {
  command: string;
  target_name: string;
  attributes: PlanetAttribute[];
}

// Para el modo local (array)
export interface LocalPlanetData extends PlanetData {
  id: string;
}