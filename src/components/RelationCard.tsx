import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Swords } from 'lucide-react';
import type { RelationWithPlants } from '../types';
import PlantImage from './PlantImage';

interface Props {
  relation: RelationWithPlants;
  focusedPlantId?: number;
}

export default function RelationCard({ relation, focusedPlantId }: Props) {
  const flip =
    focusedPlantId != null && focusedPlantId === relation.plant_b_id;

  const fromId = flip ? relation.plant_b_id : relation.plant_a_id;
  const fromName = flip ? relation.plant_b_name : relation.plant_a_name;
  const fromImg = flip ? relation.plant_b_image_url : relation.plant_a_image_url;

  const toId = flip ? relation.plant_a_id : relation.plant_b_id;
  const toName = flip ? relation.plant_a_name : relation.plant_b_name;
  const toImg = flip ? relation.plant_a_image_url : relation.plant_b_image_url;

  return (
    <div className="card-soft rounded-2xl p-4 min-w-[260px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Link
          to={`/plants/${fromId}`}
          className="flex items-center gap-2 min-w-0 no-underline group/link"
        >
          <PlantImage url={fromImg} name={fromName} size="sm" />
          <span className="text-sm font-medium text-forest-dark truncate group-hover/link:text-forest transition-colors">{fromName}</span>
        </Link>
        <ArrowRight size={14} className="text-forest/40 shrink-0" />
        <Link
          to={`/plants/${toId}`}
          className="flex items-center gap-2 min-w-0 no-underline group/link"
        >
          <PlantImage url={toImg} name={toName} size="sm" />
          <span className="text-sm font-medium text-forest-dark truncate group-hover/link:text-forest transition-colors">{toName}</span>
        </Link>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          relation.is_companion
            ? 'bg-forest/10 text-forest ring-1 ring-forest/20'
            : 'bg-terra/10 text-terra ring-1 ring-terra/20'
        }`}>
          {relation.is_companion ? <Heart size={11} /> : <Swords size={11} />}
          {relation.is_companion ? 'Companion' : 'Antagonist'}
        </span>
      </div>
      {relation.explanation && (
        <p className="text-xs text-forest/65 italic mt-2 m-0 line-clamp-2 leading-relaxed">
          "{relation.explanation}"
        </p>
      )}
    </div>
  );
}
