// models/ImageGalleryModel.ts

export interface ImageItem {
  title: string;
  nasaId: string;
  url: string;
  source: string;
  keywords: string[];
}

export interface ImageGalleryData {
  suggestions: string[];
  matchedGroupKeys: string[];
  totalItems: number;
  items: ImageItem[];
}

export interface ImageGalleryApiResponse {
  status: number;
  data: {
    data: ImageGalleryData;
  };
  errors: string | null;
  timestamp: string;
}

// Mapeo de planetas a nombres de API
export const PlanetNameMap: { [key: string]: string } = {
  'Mercury': 'mercurio',
  'Venus': 'venus',
  'Earth': 'tierra',
  'Mars': 'marte',
  'Jupiter': 'jupiter',
  'Saturn': 'saturno',
  'Uranus': 'urano',
  'Neptune': 'neptuno',
  'Pluto': 'pluton',
};

// Mapeo inverso para mostrar nombres en español
export const PlanetDisplayNames: { [key: string]: string } = {
  'mercurio': 'Mercurio',
  'venus': 'Venus',
  'tierra': 'Tierra',
  'marte': 'Marte',
  'jupiter': 'Júpiter',
  'saturno': 'Saturno',
  'urano': 'Urano',
  'neptuno': 'Neptuno',
  'pluton': 'Plutón',
};