import { get, post, patch, del } from './client';
import type { Relation, NewRelation, RelationWithPlants } from '../types';

export function getAllRelations(): Promise<RelationWithPlants[]> {
  return get<RelationWithPlants[]>('/relations');
}

export function addRelation(data: NewRelation): Promise<void> {
  return post<void>('/add_relation', data, true);
}

export function updateRelation(
  id: number,
  data: Partial<Pick<NewRelation, 'is_companion' | 'explanation'>>
): Promise<Relation> {
  return patch<Relation>(`/relations/${id}`, data, true);
}

export function deleteRelation(id: number): Promise<void> {
  return del<void>(`/relations/${id}`, true);
}

export function getUserRelationships(): Promise<Relation[]> {
  return get<Relation[]>('/user_relationships', true);
}
