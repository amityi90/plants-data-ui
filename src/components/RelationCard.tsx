import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Swords } from 'lucide-react';
import type { RelationWithPlants } from '../types';
import PlantImage from './PlantImage';

interface Props {
  relation: RelationWithPlants;
  /** Optional: if set, this plant becomes the "from" side regardless of stored direction */
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

  const tint = relation.is_companion
    ? 'border-forest/15 hover:border-forest/40'
    : 'border-terra/20 hover:border-terra/50';

  const badgeTint = relation.is_companion
    ? 'bg-forest/15 text-forest'
    : 'bg-terra/15 text-terra';

  return (
    <div
      className={`bg-white/70 border ${tint} rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 min-w-[260px]`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Link
          to={`/plants/${fromId}`}
          className="flex items-center gap-2 min-w-0 no-underline hover:text-forest"
        >
          <PlantImage url={fromImg} name={fromName} size="sm" />
          <span className="text-sm font-medium text-forest-dark truncate">{fromName}</span>
        </Link>
        <ArrowRight size={14} className="text-forest/40 shrink-0" />
        <Link
          to={`/plants/${toId}`}
          className="flex items-center gap-2 min-w-0 no-underline hover:text-forest"
        >
          <PlantImage url={toImg} name={toName} size="sm" />
          <span className="text-sm font-medium text-forest-dark truncate">{toName}</span>
        </Link>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeTint}`}
        >
          {relation.is_companion ? <Heart size={11} /> : <Swords size={11} />}
          {relation.is_companion ? 'companion' : 'antagonist'}
        </span>
      </div>
      {relation.explanation && (
        <p className="text-xs text-forest/60 italic mt-2 m-0 line-clamp-2">
          "{relation.explanation}"
        </p>
      )}
    </div>
  );
}
