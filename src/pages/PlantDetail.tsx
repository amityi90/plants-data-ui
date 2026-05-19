import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Droplets,
  Ruler,
  Leaf,
  TreePine,
  Heart,
  Swords,
  Sprout,
} from 'lucide-react';
import { getPlantById, getPlantRelations } from '../api/plants';
import { monthLabel } from '../components/MonthSelect';
import PlantImage from '../components/PlantImage';
import BoolBadge from '../components/BoolBadge';
import { CenteredSpinner } from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import FadeIn from '../components/FadeIn';
import type { Plant, RelationWithPlants } from '../types';

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const plantId = Number(id);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [relations, setRelations] = useState<RelationWithPlants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isInteger(plantId)) {
      setError('Invalid plant id');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([getPlantById(plantId), getPlantRelations(plantId)])
      .then(([p, r]) => {
        if (cancelled) return;
        setPlant(p);
        setRelations(r);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load plant');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [plantId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <CenteredSpinner label="Loading plant..." />
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <EmptyState
          icon={<Sprout size={40} />}
          title={error || 'Plant not found'}
          action={
            <Link
              to="/plants"
              className="inline-flex items-center gap-1 text-forest hover:text-forest-dark text-sm font-medium"
            >
              <ArrowLeft size={14} /> Back to plants
            </Link>
          }
        />
      </div>
    );
  }

  const companions = relations.filter((r) => r.is_companion);
  const antagonists = relations.filter((r) => !r.is_companion);

  return (
    <FadeIn>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link
          to="/plants"
          className="inline-flex items-center gap-1 text-forest/70 hover:text-forest text-sm mb-6 no-underline"
        >
          <ArrowLeft size={14} /> Back to plants
        </Link>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-8 mb-10">
          {/* Hero */}
          <div className="bg-white/70 border border-forest/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="aspect-[4/3] w-full">
              <PlantImage url={plant.image_url} name={plant.name} size="full" className="rounded-none" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {plant.is_tree ? (
                  <TreePine size={20} className="text-bark" />
                ) : (
                  <Leaf size={20} className="text-forest-light" />
                )}
                <h1
                  className="text-3xl text-forest-dark m-0"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                >
                  {plant.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-forest/70">
                {plant.height != null && (
                  <span className="inline-flex items-center gap-1">
                    <Ruler size={13} /> {plant.height} cm
                  </span>
                )}
                {plant.spread != null && (
                  <span className="inline-flex items-center gap-1">
                    ↔ {plant.spread} cm
                  </span>
                )}
                {plant.water != null && (
                  <span className="inline-flex items-center gap-1">
                    <Droplets size={13} className="text-blue-400" /> {plant.water} ml
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detail grid */}
          <div className="bg-white/70 border border-forest/10 rounded-2xl shadow-sm p-6 flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-forest/50 m-0 mb-1">Planting season</p>
              <p className="text-base text-forest-dark m-0">
                {monthLabel(plant.planting_start)} – {monthLabel(plant.planting_end)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-forest/50 m-0 mb-1">Harvesting season</p>
              <p className="text-base text-forest-dark m-0">
                {monthLabel(plant.harvesting_start)} – {monthLabel(plant.harvesting_end)}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-forest/10">
              <div>
                <p className="text-xs text-forest/50 m-0 mb-1">Shadow</p>
                <BoolBadge value={!!plant.shadow} trueLabel="Likes shade" falseLabel="Full sun" />
              </div>
              <div>
                <p className="text-xs text-forest/50 m-0 mb-1">Body water</p>
                <BoolBadge value={!!plant.body_water} trueLabel="Tolerates" falseLabel="Avoid" />
              </div>
              <div>
                <p className="text-xs text-forest/50 m-0 mb-1">Type</p>
                <BoolBadge value={!!plant.is_tree} trueLabel="Tree" falseLabel="Plant" />
              </div>
            </div>
          </div>
        </div>

        {/* Relationships */}
        <div className="grid md:grid-cols-2 gap-6">
          <RelationSection
            title="Companions"
            icon={<Heart size={18} className="text-forest" />}
            tint="bg-forest/5 border-forest/10"
            badgeTint="bg-forest/15 text-forest"
            relations={companions}
            currentId={plant.id}
            emptyText="No companions logged yet."
          />
          <RelationSection
            title="Antagonists"
            icon={<Swords size={18} className="text-terra" />}
            tint="bg-terra/5 border-terra/15"
            badgeTint="bg-terra/15 text-terra"
            relations={antagonists}
            currentId={plant.id}
            emptyText="No antagonists logged yet."
          />
        </div>
      </div>
    </FadeIn>
  );
}

function RelationSection({
  title,
  icon,
  tint,
  badgeTint,
  relations,
  currentId,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  tint: string;
  badgeTint: string;
  relations: RelationWithPlants[];
  currentId: number;
  emptyText: string;
}) {
  return (
    <section className={`rounded-2xl border ${tint} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl text-forest-dark m-0" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h2>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${badgeTint}`}>
          {relations.length}
        </span>
      </div>
      {relations.length === 0 ? (
        <p className="text-sm text-forest/50 m-0">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-2 m-0 p-0 list-none">
          {relations.map((r) => {
            const flip = r.plant_a_id === currentId;
            const otherId = flip ? r.plant_b_id : r.plant_a_id;
            const otherName = flip ? r.plant_b_name : r.plant_a_name;
            const otherImg = flip ? r.plant_b_image_url : r.plant_a_image_url;
            return (
              <li key={r.id}>
                <Link
                  to={`/plants/${otherId}`}
                  className="flex items-center gap-3 bg-white/70 border border-forest/10 rounded-xl px-3 py-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
                >
                  <PlantImage url={otherImg} name={otherName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-forest-dark m-0 truncate">{otherName}</p>
                    {r.explanation && (
                      <p className="text-xs text-forest/55 italic m-0 mt-0.5 line-clamp-1">
                        "{r.explanation}"
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
