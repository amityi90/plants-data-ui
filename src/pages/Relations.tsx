import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Heart, Swords, Layers, List } from 'lucide-react';
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
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <GitBranch size={28} className="text-forest" />
          <h1 className="text-3xl text-forest-dark m-0">Relationships</h1>
          <span className="ml-auto text-sm text-forest/60">
            {filtered.length} {filtered.length === 1 ? 'relation' : 'relations'}
          </span>
        </div>

        {/* Controls */}
        <div className="bg-white/60 border border-forest/10 rounded-2xl shadow-sm p-4 mb-6 grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <div>
            <label className="block text-xs uppercase tracking-wide text-forest/50 mb-1">
              Focus on a plant
            </label>
            <PlantSearchInput
              value={focused?.id ?? null}
              onChange={(p) => setFocused(p)}
              placeholder="Search a plant..."
            />
          </div>

          <FilterToggle filter={filter} onChange={setFilter} />
          <ViewToggle view={view} onChange={setView} />
        </div>

        {loading && <CenteredSpinner label="Loading relationships..." />}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<GitBranch size={40} />}
            title="No relationships match."
            subtitle={
              focused
                ? `No relationships found for ${focused.name} with the current filter.`
                : 'Try changing the filter.'
            }
          />
        )}

        {!loading && filtered.length > 0 && view === 'flat' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <RelationCard key={r.id} relation={r} focusedPlantId={focused?.id} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && view === 'grouped' && (
          <div className="flex flex-col gap-6">
            {groupedByPlant.map(({ plant, rels }) => (
              <section
                key={plant!.id}
                className="bg-white/70 border border-forest/10 rounded-2xl shadow-sm p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <PlantImage url={plant!.image_url} name={plant!.name} size="sm" />
                  <h2
                    className="text-xl text-forest-dark m-0"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                  >
                    {plant!.name}
                  </h2>
                  <span className="text-xs text-forest/50">
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
                          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-forest/5 transition-colors no-underline"
                        >
                          <PlantImage url={otherImg} name={otherName} size="sm" />
                          <span className="text-sm font-medium text-forest-dark flex-1 min-w-0 truncate">
                            {otherName}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                              r.is_companion
                                ? 'bg-forest/15 text-forest'
                                : 'bg-terra/15 text-terra'
                            }`}
                          >
                            {r.is_companion ? <Heart size={11} /> : <Swords size={11} />}
                            {r.is_companion ? 'companion' : 'antagonist'}
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
      className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        filter === mode ? activeClass : 'text-forest/60 hover:bg-forest/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-1 bg-soil rounded-xl p-1">
      {opt('all', 'All', null, 'bg-white text-forest-dark shadow-sm')}
      {opt('companions', 'Companions', <Heart size={13} />, 'bg-forest text-cream')}
      {opt('antagonists', 'Antagonists', <Swords size={13} />, 'bg-terra text-cream')}
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
    <div className="flex items-center gap-1 bg-soil rounded-xl p-1">
      <button
        type="button"
        onClick={() => onChange('grouped')}
        title="Grouped by plant"
        className={`p-2 rounded-lg transition-colors ${
          view === 'grouped'
            ? 'bg-white text-forest-dark shadow-sm'
            : 'text-forest/60 hover:bg-forest/5'
        }`}
      >
        <Layers size={16} />
      </button>
      <button
        type="button"
        onClick={() => onChange('flat')}
        title="Flat list"
        className={`p-2 rounded-lg transition-colors ${
          view === 'flat'
            ? 'bg-white text-forest-dark shadow-sm'
            : 'text-forest/60 hover:bg-forest/5'
        }`}
      >
        <List size={16} />
      </button>
    </div>
  );
}
