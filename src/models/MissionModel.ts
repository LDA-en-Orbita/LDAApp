// models/MissionModel.ts

export interface Achievement {
  year: string | number;
  description: string;
  significance: string;
}

export interface MissionDuration {
  planned_years?: number;
  current_years?: number;
  cruise_years?: number;
  total_years?: number;
  orbital_years?: number;
}

export interface GravityAssist {
  planet: string;
  date: string;
}

export interface Trajectory {
  gravity_assists?: GravityAssist[];
}

export interface LandingSite {
  name: string;
  latitude: number;
  longitude: number;
  notable_feature?: string;
}

export interface CompanionVehicle {
  name: string;
  type: string;
  description: string;
  status: string;
  achievements?: string;
}

export interface MissionData {
  planet_code: string;
  id: string;
  name: string;
  name_es: string;
  full_name?: string;
  mission_type: string;
  target_body: string;
  primary_target?: string;
  agency: string;
  launch_date: string;
  arrival_date: string;
  mission_end_date: string | null;
  status: string;
  current_status_description: string;
  landing_site?: LandingSite;
  mission_duration: MissionDuration;
  trajectory?: Trajectory;
  companion_vehicles?: CompanionVehicle[];
  achievements: Achievement[];
  scientific_objectives: string[];
  key_instruments: string[];
  mission_highlights: string[];
  description: string;
  official_url: string;
  images: string[];
  related_bodies: string[];
}

export interface MissionsData {
  data: MissionData[];
  nextCursor: number;
  hasMore: boolean;
}

export interface MissionsApiResponse {
  status: number;
  data: MissionsData;
  errors: string | null;
  timestamp: string;
}
