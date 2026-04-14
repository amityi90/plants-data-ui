import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAllPlants } from '../api/plants';
import type { Plant } from '../types';

interface PlantsContextValue {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const PlantsContext = createContext<PlantsContextValue | null>(null);

export function PlantsProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPlants() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPlants();
      setPlants(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load plants');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPlants(); }, []);

  return (
    <PlantsContext.Provider value={{ plants, loading, error, refresh: fetchPlants }}>
      {children}
    </PlantsContext.Provider>
  );
}

export function usePlants(): PlantsContextValue {
  const ctx = useContext(PlantsContext);
  if (!ctx) throw new Error('usePlants must be used inside PlantsProvider');
  return ctx;
}
