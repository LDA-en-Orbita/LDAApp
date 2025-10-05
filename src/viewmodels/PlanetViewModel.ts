// viewmodels/PlanetViewModel.ts
import { useCallback, useState } from 'react';
import { LocalPlanetData, PlanetData } from '../models/PlanetModel';
import PlanetService from '../services/planetService';

interface UsePlanetDataReturn {
  planetData: PlanetData | null;
  loading: boolean;
  error: string | null;
  fetchPlanetData: (useService: boolean, localData?: LocalPlanetData[], planetName?: string) => Promise<void>;
  clearData: () => void;
}

export const usePlanetData = (): UsePlanetDataReturn => {
  const [planetData, setPlanetData] = useState<PlanetData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanetData = useCallback(async (
    useService: boolean, 
    localData?: LocalPlanetData[], 
    planetName?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await PlanetService.getPlanetData(useService, localData, planetName);
      setPlanetData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setPlanetData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setPlanetData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    planetData,
    loading,
    error,
    fetchPlanetData,
    clearData,
  };
};