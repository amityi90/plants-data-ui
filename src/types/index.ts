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
  image_url: string | null;
  approved: boolean;
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
  image_url: string | null;
}

export interface Relation {
  id: number;
  plant_a_id: number;
  plant_b_id: number;
  is_companion: boolean;
  explanation: string;
  created_at: string;
  approved: boolean;
}

export interface NewRelation {
  plant_a_id: number;
  plant_b_id: number;
  is_companion: boolean;
  explanation: string;
}

export interface RelationWithPlants extends Relation {
  plant_a_name: string;
  plant_a_image_url: string | null;
  plant_b_name: string;
  plant_b_image_url: string | null;
}

export interface AuthUser {
  email: string;
}
