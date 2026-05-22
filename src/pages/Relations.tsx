import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Heart, Swords, Layers, List, Search } from 'lucide-react';
import { getAllRelations } from '../api/relations';
import PlantSearchInput from '../components/PlantSearchInput';
import PlantImage from '../components/PlantImage';
import RelationCard from '../components/RelationCard';
import { CenteredSpinner } from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import FadeIn from '../components/FadeIn';
import { usePlants } from '../context/PlantsContext';
import type { RelationWithPlants, Plant } from '../types';

type FilterMode = 'all' | 'companions' | 'antagonists';
type ViewMode = 'grouped' | 'flat';

export default function Relations() {
  const { plants } = usePlants();
  const [relations, setRelations] = useState<RelationWithPlants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<Plant | null>(null);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [view, setView] = useState<ViewMode>('grouped');

  useEffect(() => {
    let cancelled = false;
    getAllRelations()
      .then((r) => {
        if (!cancelled) setRelations(r);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load relations');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return relations.filter((r) => {
      if (filter === 'companions' && !r.is_companion) return false;
      if (filter === 'antagonists' && r.is_companion) return false;
      if (focused) {
        if (r.plant_a_id !== focused.id && r.plant_b_id !== focused.id) return false;
      }
      return true;
    });
  }, [relations, filter, focused]);

  const groupedByPlant = useMemo(() => {
    const map = new Map<number, RelationWithPlants[]>();
    for (const r of filtered) {
      if (!map.has(r.plant_a_id)) map.set(r.plant_a_id, []);
      if (!map.has(r.plant_b_id)) map.set(r.plant_b_id, []);
      map.get(r.plant_a_id)!.push(r);
      map.get(r.plant_b_id)!.push(r);
    }
    return Array.from(map.entries())
      .map(([plantId, rels]) => ({
        plant: plants.find((p) => p.id === plantId),
        rels,
      }))
      .filter((g) => g.plant != null)
      .sort((a, b) => a.plant!.name.localeCompare(b.plant!.name));
  }, [filtered, plants]);

  return (
    <FadeIn>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-8 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.25em] text-forest/50 mb-2">Browse</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="serif text-4xl text-forest-dark m-0 tracking-tight">
              <GitBranch className="inline-block mr-2 -mt-2 text-forest" size={30} />
              Relationships
            </h1>
            <span className="text-sm text-forest/55">
              {filtered.length} {filtered.length === 1 ? 'relation' : 'relations'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="card-soft rounded-2xl p-4 mb-6 grid gap-4 md:grid-cols-[1fr_auto_auto] items-end animate-fade-in-up delay-75">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-forest/55 mb-1.5">
              Focus on a plant
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 border border-forest/15">
              <Search size={15} className="text-forest/55 shrink-0" />
              <PlantSearchInput
                value={focused?.id ?? null}
                onChange={(p) => setFocused(p)}
                placeholder="Search a plant…"
              />
            </div>
          </div>

          <FilterToggle filter={filter} onChange={setFilter} />
          <ViewToggle view={view} onChange={setView} />
        </div>

        {loading && <CenteredSpinner label="Loading relationships…" />}

        {error && (
          <div className="rounded-2xl bg-terra/10 border border-terra/30 px-5 py-4 text-terra">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<GitBranch size={36} strokeWidth={1.5} />}
            title="No relationships match."
            subtitle={
              focused
                ? `Nothing found for ${focused.name} with the current filter.`
                : 'Try changing the filter.'
            }
          />
        )}

        {!loading && filtered.length > 0 && view === 'flat' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up delay-150">
            {filtered.map((r) => (
              <RelationCard key={r.id} relation={r} focusedPlantId={focused?.id} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && view === 'grouped' && (
          <div className="flex flex-col gap-5 animate-fade-in-up delay-150">
            {groupedByPlant.map(({ plant, rels }) => (
              <section
                key={plant!.id}
                className="card-soft rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <PlantImage url={plant!.image_url} name={plant!.name} size="sm" />
                  <h2 className="serif text-xl font-semibold text-forest-dark m-0 tracking-tight">
                    {plant!.name}
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest/45">
                    {rels.length} {rels.length === 1 ? 'relation' : 'relations'}
                  </span>
                </div>
                <ul className="flex flex-col gap-1 m-0 p-0 list-none">
                  {rels.map((r) => {
                    const flip = r.plant_a_id === plant!.id;
                    const otherId = flip ? r.plant_b_id : r.plant_a_id;
                    const otherName = flip ? r.plant_b_name : r.plant_a_name;
                    const otherImg = flip ? r.plant_b_image_url : r.plant_a_image_url;
                    return (
                      <li key={`${plant!.id}-${r.id}`}>
                        <Link
                          to={`/plants/${otherId}`}
                          className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-forest/5 transition-colors no-underline"
                        >
                          <PlantImage url={otherImg} name={otherName} size="sm" />
                          <span className="text-sm font-medium text-forest-dark flex-1 min-w-0 truncate">
                            {otherName}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              r.is_companion
                                ? 'bg-forest/10 text-forest ring-1 ring-forest/20'
                                : 'bg-terra/10 text-terra ring-1 ring-terra/20'
                            }`}
                          >
                            {r.is_companion ? <Heart size={11} /> : <Swords size={11} />}
                            {r.is_companion ? 'Companion' : 'Antagonist'}
                          </span>
                          {r.explanation && (
                            <span className="hidden md:inline text-xs text-forest/55 italic truncate max-w-[40%]">
                              "{r.explanation}"
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

function FilterToggle({
  filter,
  onChange,
}: {
  filter: FilterMode;
  onChange: (m: FilterMode) => void;
}) {
  const opt = (mode: FilterMode, label: string, icon: React.ReactNode, activeClass: string) => (
    <button
      type="button"
      onClick={() => onChange(mode)}
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
        filter === mode ? activeClass : 'text-forest/55 hover:text-forest hover:bg-white/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div className="inline-flex rounded-full bg-cream-dark/60 ring-1 ring-forest/15 p-0.5 gap-0.5">
      {opt('all', 'All', null, 'bg-forest text-cream shadow-sm shadow-forest/20')}
      {opt('companions', 'Companions', <Heart size={11} />, 'bg-forest text-cream shadow-sm shadow-forest/20')}
      {opt('antagonists', 'Antagonists', <Swords size={11} />, 'bg-terra text-cream shadow-sm shadow-terra/20')}
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-cream-dark/60 ring-1 ring-forest/15 p-0.5 gap-0.5">
      <button
        type="button"
        onClick={() => onChange('grouped')}
        title="Grouped by plant"
        className={`p-1.5 rounded-full transition-all ${
          view === 'grouped'
            ? 'bg-forest text-cream shadow-sm shadow-forest/20'
            : 'text-forest/55 hover:text-forest hover:bg-white/50'
        }`}
      >
        <Layers size={16} />
      </button>
      <button
        type="button"
        onClick={() => onChange('flat')}
        title="Flat list"
        className={`p-1.5 rounded-full transition-all ${
          view === 'flat'
            ? 'bg-forest text-cream shadow-sm shadow-forest/20'
            : 'text-forest/55 hover:text-forest hover:bg-white/50'
        }`}
      >
        <List size={16} />
      </button>
    </div>
  );
}
