// models/MissionModel.ts

export interface Achievement {
  year: string | number;
  description: string;
  significance: string;
}

export interface MissionDuration {
  total_years: number;
  orbital_years: number;
}

export interface MissionData {
  planet_code: string;
  id: string;
  name: string;
  name_es: string;
  mission_type: string;
  target_body: string;
  agency: string;
  launch_date: string;
  arrival_date: string;
  mission_end_date: string;
  status: string;
  current_status_description: string;
  mission_duration: MissionDuration;
  achievements: Achievement[];
  scientific_objectives: string[];
  key_instruments: string[];
  mission_highlights: string[];
  description: string;
  official_url: string;
  images: string[];
  related_bodies: string[];
}

export interface MissionsApiResponse {
  status: number;
  data: {
    data: MissionData[];
  };
  errors: string | null;
  timestamp: string;
}
