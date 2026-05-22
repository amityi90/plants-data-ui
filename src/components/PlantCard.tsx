import { Link } from 'react-router-dom';
import { Droplets, TreePine, Leaf, Ruler } from 'lucide-react';
import type { Plant } from '../types';
import PlantImage from './PlantImage';

interface Props {
  plant: Plant;
}

export default function PlantCard({ plant }: Props) {
  return (
    <Link
      to={`/plants/${plant.id}`}
      className="group block card-soft rounded-2xl overflow-hidden no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(45,106,79,0.35)]"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        <PlantImage url={plant.image_url} name={plant.name} size="full" className="rounded-none transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${
            plant.is_tree
              ? 'bg-bark/15 text-bark ring-1 ring-bark/20'
              : 'bg-forest-light/20 text-forest ring-1 ring-forest/15'
          }`}>
            {plant.is_tree ? <TreePine size={15} strokeWidth={1.7} /> : <Leaf size={15} strokeWidth={1.7} />}
          </span>
          <h3 className="serif text-lg font-semibold text-forest-dark m-0 truncate group-hover:text-forest transition-colors tracking-tight">
            {plant.name}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-forest/70">
          {plant.height != null && (
            <span className="inline-flex items-center gap-1">
              <Ruler size={12} className="text-bark" />
              <span className="font-semibold text-forest-dark">{plant.height}</span>
              <span className="text-forest/40">cm</span>
            </span>
          )}
          {plant.water != null && (
            <span className="inline-flex items-center gap-1">
              <Droplets size={12} className="text-forest-light" />
              <span className="font-semibold text-forest-dark">{plant.water}</span>
              <span className="text-forest/40">ml</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
