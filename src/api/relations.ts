import { get, post } from './client';
import type { Relation, NewRelation } from '../types';

export function addRelation(data: NewRelation): Promise<void> {
  return post<void>('/add_relation', data, true);
}

export function getUserRelationships(): Promise<Relation[]> {
  return get<Relation[]>('/user_relationships', true);
}
