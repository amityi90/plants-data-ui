import { get, post, patch, del } from './client';
import type { Plant, NewPlant, RelationWithPlants } from '../types';

export function getAllPlants(): Promise<Plant[]> {
  return get<Plant[]>('/get_all_plants');
}

export function getPlantById(id: number): Promise<Plant> {
  return get<Plant>(`/plants/${id}`);
}

export function getPlantRelations(id: number): Promise<RelationWithPlants[]> {
  return get<RelationWithPlants[]>(`/plants/${id}/relations`);
}

export function addPlant(data: NewPlant): Promise<void> {
  return post<void>('/add_plant', data, true);
}

export function updatePlant(id: number, data: Partial<NewPlant>): Promise<Plant> {
  return patch<Plant>(`/plants/${id}`, data, true);
}

export function deletePlant(id: number): Promise<void> {
  return del<void>(`/plants/${id}`, true);
}

export function getUserPlants(): Promise<Plant[]> {
  return get<Plant[]>('/user_plants', true);
}
