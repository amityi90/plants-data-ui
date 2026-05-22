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
        <CenteredSpinner label="Loading plant…" />
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <EmptyState
          icon={<Sprout size={36} strokeWidth={1.5} />}
          title={error || 'Plant not found'}
          action={
            <Link
              to="/plants"
              className="inline-flex items-center gap-1.5 text-forest hover:text-forest-dark text-sm font-medium mt-2"
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
          className="inline-flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest transition-colors mb-5 no-underline"
        >
          <ArrowLeft size={14} /> Back to plants
        </Link>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-8 mb-10">
          {/* Hero */}
          <div className="card-soft rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="aspect-[4/3] w-full">
              <PlantImage url={plant.image_url} name={plant.name} size="full" className="rounded-none" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${
                  plant.is_tree
                    ? 'bg-bark/15 text-bark ring-1 ring-bark/20'
                    : 'bg-forest-light/20 text-forest ring-1 ring-forest/15'
                }`}>
                  {plant.is_tree ? <TreePine size={18} strokeWidth={1.7} /> : <Leaf size={18} strokeWidth={1.7} />}
                </span>
                <h1 className="serif text-3xl font-semibold text-forest-dark m-0 tracking-tight">
                  {plant.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm text-forest/70">
                {plant.height != null && (
                  <span className="inline-flex items-center gap-1">
                    <Ruler size={13} className="text-bark" />
                    <span className="font-semibold text-forest-dark">{plant.height}</span> cm
                  </span>
                )}
                {plant.spread != null && (
                  <span className="inline-flex items-center gap-1">
                    ↔ <span className="font-semibold text-forest-dark">{plant.spread}</span> cm
                  </span>
                )}
                {plant.water != null && (
                  <span className="inline-flex items-center gap-1">
                    <Droplets size={13} className="text-forest-light" />
                    <span className="font-semibold text-forest-dark">{plant.water}</span> ml
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="card-soft rounded-3xl p-6 flex flex-col gap-5 animate-fade-in-up delay-75">
            <Fact label="Planting season" value={`${monthLabel(plant.planting_start)} – ${monthLabel(plant.planting_end)}`} />
            <Fact label="Harvesting season" value={`${monthLabel(plant.harvesting_start)} – ${monthLabel(plant.harvesting_end)}`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-forest/10">
              <BadgeCol label="Shadow" badge={<BoolBadge value={!!plant.shadow} trueLabel="Likes shade" falseLabel="Full sun" />} />
              <BadgeCol label="Body water" badge={<BoolBadge value={!!plant.body_water} trueLabel="Tolerates" falseLabel="Avoid" />} />
              <BadgeCol label="Type" badge={<BoolBadge value={!!plant.is_tree} trueLabel="Tree" falseLabel="Plant" />} />
            </div>
          </div>
        </div>

        {/* Relationships */}
        <div className="grid md:grid-cols-2 gap-6">
          <RelationSection
            title="Companions"
            icon={<Heart size={18} className="text-forest" />}
            relations={companions}
            currentId={plant.id}
            emptyText="No companions logged yet."
            delay="delay-150"
          />
          <RelationSection
            title="Antagonists"
            icon={<Swords size={18} className="text-terra" />}
            relations={antagonists}
            currentId={plant.id}
            emptyText="No antagonists logged yet."
            tone="terra"
            delay="delay-225"
          />
        </div>
      </div>
    </FadeIn>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-forest/50 m-0 mb-1">{label}</p>
      <p className="text-base text-forest-dark m-0">{value}</p>
    </div>
  );
}

function BadgeCol({ label, badge }: { label: string; badge: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-forest/45 mb-1.5">{label}</p>
      {badge}
    </div>
  );
}

function RelationSection({
  title,
  icon,
  relations,
  currentId,
  emptyText,
  tone = 'forest',
  delay = '',
}: {
  title: string;
  icon: React.ReactNode;
  relations: RelationWithPlants[];
  currentId: number;
  emptyText: string;
  tone?: 'forest' | 'terra';
  delay?: string;
}) {
  return (
    <section className={`card-soft rounded-2xl p-5 animate-fade-in-up ${delay}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${
          tone === 'terra'
            ? 'bg-terra/10 ring-1 ring-terra/20'
            : 'bg-forest/8 ring-1 ring-forest/15'
        }`}>
          {icon}
        </span>
        <h2 className="serif text-xl text-forest-dark m-0 tracking-tight">{title}</h2>
        <span className={`ml-auto text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          tone === 'terra'
            ? 'bg-terra/10 text-terra ring-1 ring-terra/20'
            : 'bg-forest/10 text-forest ring-1 ring-forest/20'
        }`}>
          {relations.length}
        </span>
      </div>
      {relations.length === 0 ? (
        <p className="text-sm text-forest/50 m-0 serif italic">{emptyText}</p>
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
                  className="flex items-center gap-3 bg-white/60 border border-forest/10 rounded-xl px-3 py-2 hover:bg-white/85 hover:border-forest/25 hover:-translate-y-0.5 transition-all duration-200 no-underline"
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
