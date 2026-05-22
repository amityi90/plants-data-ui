import { useState } from 'react';
import {
  List,
  Grid3x3,
  ChevronUp,
  ChevronDown,
  Droplets,
  ArrowUpDown,
  TreePine,
  Leaf,
  Sprout,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlants } from '../context/PlantsContext';
import { monthLabel } from '../components/MonthSelect';
import PlantCard from '../components/PlantCard';
import BoolBadge from '../components/BoolBadge';
import { CenteredSpinner } from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import FadeIn from '../components/FadeIn';
import type { Plant } from '../types';

type SortKey = 'name' | 'height' | 'water' | 'planting_start';
type SortDir = 'asc' | 'desc';
type ViewMode = 'cards' | 'table';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'planting_start', label: 'Planting season' },
  { key: 'height', label: 'Height' },
  { key: 'water', label: 'Water' },
];

function SortButton({
  label,
  sortKey,
  current,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onClick(sortKey)}
      className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors ${
        active ? 'text-forest' : 'text-forest/45 hover:text-forest'
      }`}
    >
      {label}
      {active ? (
        dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
      ) : (
        <ArrowUpDown size={12} />
      )}
    </button>
  );
}

export default function ShowAllPlants() {
  const { plants, loading, error } = usePlants();
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>('cards');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = plants
    .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      const cmp =
        typeof av === 'string'
          ? av.localeCompare(bv as string)
          : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  return (
    <FadeIn>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-8 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.25em] text-forest/50 mb-2">Browse</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="serif text-4xl text-forest-dark m-0 tracking-tight">All plants</h1>
            <span className="text-sm text-forest/55">
              {plants.length} in the database
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="card-soft rounded-2xl p-3 sm:p-4 mb-6 flex flex-col md:flex-row md:items-center gap-3 animate-fade-in-up delay-75">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 border border-forest/15">
            <Search size={16} className="text-forest/55 shrink-0" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name…"
              className="flex-1 bg-transparent outline-none text-forest-dark placeholder-forest/35 text-sm"
            />
            {filter && (
              <button onClick={() => setFilter('')} className="text-xs text-forest/55 hover:text-forest">
                Clear
              </button>
            )}
          </div>

          {view === 'cards' && (
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase tracking-wider text-forest/55">Sort</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="rounded-xl border border-forest/20 bg-white/80 px-2.5 py-1.5 text-sm text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/40 transition-all"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
              <button
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                className="p-1.5 rounded-lg border border-forest/20 bg-white/60 text-forest/70 hover:bg-forest/10 transition-colors"
                title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          )}

          <div className="md:ml-auto inline-flex rounded-full bg-cream-dark/60 ring-1 ring-forest/15 p-0.5 gap-0.5">
            <button
              onClick={() => setView('cards')}
              title="Card view"
              className={`p-1.5 rounded-full transition-all ${
                view === 'cards'
                  ? 'bg-forest text-cream shadow-sm shadow-forest/20'
                  : 'text-forest/55 hover:text-forest hover:bg-white/50'
              }`}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setView('table')}
              title="Table view"
              className={`p-1.5 rounded-full transition-all ${
                view === 'table'
                  ? 'bg-forest text-cream shadow-sm shadow-forest/20'
                  : 'text-forest/55 hover:text-forest hover:bg-white/50'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {loading && <CenteredSpinner label="Loading plants…" />}

        {error && (
          <div className="rounded-2xl bg-terra/10 border border-terra/30 px-5 py-4 text-terra">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon={<Sprout size={36} strokeWidth={1.5} />} title="No plants found." />
        )}

        {!loading && filtered.length > 0 && view === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up delay-150">
            {filtered.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && view === 'table' && (
          <div className="card-soft rounded-2xl overflow-hidden animate-fade-in-up delay-150">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-3 bg-forest/5 border-b border-forest/10 text-xs">
              <SortButton label="Name" sortKey="name" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortButton label="Planting" sortKey="planting_start" current={sortKey} dir={sortDir} onClick={handleSort} />
              <span className="text-forest/45 font-bold uppercase tracking-wider">Harvesting</span>
              <SortButton label="Height" sortKey="height" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortButton label="Water" sortKey="water" current={sortKey} dir={sortDir} onClick={handleSort} />
              <span />
            </div>

            {filtered.map((plant: Plant) => (
              <div key={plant.id}>
                <div
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-3 border-b border-forest/5 items-center cursor-pointer hover:bg-forest/5 transition-colors ${
                    expanded === plant.id ? 'bg-forest/5' : ''
                  }`}
                  onClick={() => setExpanded(expanded === plant.id ? null : plant.id)}
                >
                  <div className="flex items-center gap-2 font-medium text-forest-dark">
                    {plant.is_tree ? (
                      <TreePine size={15} className="text-bark shrink-0" />
                    ) : (
                      <Leaf size={15} className="text-forest-light shrink-0" />
                    )}
                    <Link
                      to={`/plants/${plant.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-forest no-underline"
                    >
                      {plant.name}
                    </Link>
                  </div>
                  <span className="text-sm text-forest/70">
                    {monthLabel(plant.planting_start)}–{monthLabel(plant.planting_end)}
                  </span>
                  <span className="text-sm text-forest/70">
                    {monthLabel(plant.harvesting_start)}–{monthLabel(plant.harvesting_end)}
                  </span>
                  <span className="text-sm text-forest/70">{plant.height} cm</span>
                  <span className="flex items-center gap-1 text-sm text-forest/70">
                    <Droplets size={12} className="text-forest-light" />
                    {plant.water} ml
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-forest/40 transition-transform ${
                      expanded === plant.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {expanded === plant.id && (
                  <div className="px-6 py-4 bg-cream-dark/40 border-b border-forest/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm animate-fade-in">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-forest/45 mb-1">Spread</p>
                      <p className="text-forest-dark font-medium m-0">{plant.spread} cm</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-forest/45 mb-1">Shadow</p>
                      <BoolBadge value={plant.shadow} trueLabel="Likes shade" falseLabel="Full sun" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-forest/45 mb-1">Body water</p>
                      <BoolBadge value={plant.body_water} trueLabel="Tolerates" falseLabel="Avoid" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-forest/45 mb-1">Type</p>
                      <BoolBadge value={plant.is_tree} trueLabel="Tree" falseLabel="Plant" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FadeIn>
  );
}
