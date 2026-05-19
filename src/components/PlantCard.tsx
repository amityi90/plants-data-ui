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
      className="group block bg-white/70 border border-forest/10 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden no-underline"
    >
      <div className="aspect-[16/10] w-full">
        <PlantImage url={plant.image_url} name={plant.name} size="full" className="rounded-none" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {plant.is_tree ? (
            <TreePine size={16} className="text-bark shrink-0" />
          ) : (
            <Leaf size={16} className="text-forest-light shrink-0" />
          )}
          <h3
            className="text-lg text-forest-dark m-0 truncate group-hover:text-forest transition-colors"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            {plant.name}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-forest/65">
          {plant.height != null && (
            <span className="inline-flex items-center gap-1">
              <Ruler size={12} />
              {plant.height} cm
            </span>
          )}
          {plant.water != null && (
            <span className="inline-flex items-center gap-1">
              <Droplets size={12} className="text-blue-400" />
              {plant.water} ml
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
