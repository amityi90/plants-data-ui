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
      className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
        active ? 'text-forest' : 'text-forest/50 hover:text-forest'
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
        <div className="flex items-center gap-3 mb-6">
          <Leaf size={28} className="text-forest" />
          <h1 className="text-3xl text-forest-dark m-0">All Plants</h1>
          <span className="ml-auto text-sm text-forest/60">
            {plants.length} plants in database
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name..."
            className="flex-1 max-w-sm rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/50"
          />

          {view === 'cards' && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-forest/60">Sort by</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="rounded-lg border border-forest/30 bg-cream px-2 py-1 text-sm text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/50"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                className="p-1.5 rounded-lg border border-forest/20 text-forest/70 hover:bg-forest/5 transition-colors"
                title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          )}

          <div className="md:ml-auto flex items-center gap-1 bg-soil rounded-xl p-1">
            <button
              onClick={() => setView('cards')}
              title="Card view"
              className={`p-2 rounded-lg transition-colors ${
                view === 'cards'
                  ? 'bg-white text-forest-dark shadow-sm'
                  : 'text-forest/60 hover:bg-forest/5'
              }`}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setView('table')}
              title="Table view"
              className={`p-2 rounded-lg transition-colors ${
                view === 'table'
                  ? 'bg-white text-forest-dark shadow-sm'
                  : 'text-forest/60 hover:bg-forest/5'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {loading && <CenteredSpinner label="Loading plants..." />}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon={<Sprout size={40} />} title="No plants found." />
        )}

        {!loading && filtered.length > 0 && view === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && view === 'table' && (
          <div className="rounded-2xl border border-forest/10 overflow-hidden shadow-sm bg-white/60">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-3 bg-soil border-b border-forest/10 text-xs">
              <SortButton label="Name" sortKey="name" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortButton label="Planting" sortKey="planting_start" current={sortKey} dir={sortDir} onClick={handleSort} />
              <span className="text-forest/50 font-semibold text-sm">Harvesting</span>
              <SortButton label="Height" sortKey="height" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortButton label="Water" sortKey="water" current={sortKey} dir={sortDir} onClick={handleSort} />
              <span />
            </div>

            {filtered.map((plant: Plant) => (
              <div key={plant.id}>
                <div
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-3 border-b border-forest/5 items-center cursor-pointer hover:bg-forest/5 transition-colors ${
                    expanded === plant.id ? 'bg-cream' : ''
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
                    <Droplets size={12} className="text-blue-400" />
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
                  <div className="px-6 py-4 bg-soil/60 border-b border-forest/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-forest/50">Spread</span>
                      <p className="text-forest-dark font-medium">{plant.spread} cm</p>
                    </div>
                    <div>
                      <span className="text-forest/50">Shadow</span>
                      <p>
                        <BoolBadge value={plant.shadow} trueLabel="Likes shade" falseLabel="Full sun" />
                      </p>
                    </div>
                    <div>
                      <span className="text-forest/50">Body water</span>
                      <p>
                        <BoolBadge value={plant.body_water} trueLabel="Tolerates" falseLabel="Avoid" />
                      </p>
                    </div>
                    <div>
                      <span className="text-forest/50">Type</span>
                      <p>
                        <BoolBadge value={plant.is_tree} trueLabel="Tree" falseLabel="Plant" />
                      </p>
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
