export interface Plant {
  id: number;
  name: string;
  planting_start: number;
  planting_end: number;
  harvesting_start: number;
  harvesting_end: number;
  water: number;
  shadow: boolean;
  height: number;
  spread: number;
  body_water: boolean;
  is_tree: boolean;
}

export interface NewPlant {
  name: string;
  planting_start: number;
  planting_end: number;
  harvesting_start: number;
  harvesting_end: number;
  water: number;
  shadow: boolean;
  height: number;
  spread: number;
  body_water: boolean;
  is_tree: boolean;
}

export interface Relation {
  id: number;
  plant_a_id: number;
  plant_b_id: number;
  is_companion: boolean;
  explanation: string;
}

export interface NewRelation {
  plant_a_id: number;
  plant_b_id: number;
  is_companion: boolean;
  explanation: string;
}

export interface AuthUser {
  email: string;
}
