import { get, post } from './client';
import type { Plant, NewPlant } from '../types';

export function getAllPlants(): Promise<Plant[]> {
  return get<Plant[]>('/get_all_plants');
}

export function addPlant(data: NewPlant): Promise<void> {
  return post<void>('/add_plant', data, true);
}

export function getUserPlants(): Promise<Plant[]> {
  return get<Plant[]>('/user_plants', true);
}
