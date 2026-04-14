import { useState } from 'react';
import { List, ChevronUp, ChevronDown, Droplets, ArrowUpDown, TreePine, Leaf } from 'lucide-react';
import { usePlants } from '../context/PlantsContext';
import { monthLabel } from '../components/MonthSelect';
import type { Plant } from '../types';

type SortKey = 'name' | 'height' | 'water' | 'planting_start';
type SortDir = 'asc' | 'desc';

function SortButton({ label, sortKey, current, dir, onClick }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onClick(sortKey)}
      className={`flex items-center gap-1 text-sm font-semibold transition-colors ${active ? 'text-forest' : 'text-forest/50 hover:text-forest'}`}
    >
      {label}
      {active ? (dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={12} />}
    </button>
  );
}

function BoolBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-forest/15 text-forest-dark' : 'bg-forest/5 text-forest/40'}`}>
      {value ? trueLabel : falseLabel}
    </span>
  );
}

export default function ShowAllPlants() {
  const { plants, loading, error } = usePlants();
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = plants
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <List size={28} className="text-forest" />
        <h1 className="text-3xl text-forest-dark m-0">All Plants</h1>
        <span className="ml-auto text-sm text-forest/60">{plants.length} plants in database</span>
      </div>

      {/* Filter */}
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter by name..."
        className="w-full max-w-sm mb-6 rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/50"
      />

      {loading && (
        <div className="text-center py-16 text-forest/60">Loading plants...</div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 mb-4">{error}</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-forest/50">No plants found.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="rounded-2xl border border-forest/10 overflow-hidden shadow-sm bg-white/60">
          {/* Table header */}
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
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-3 border-b border-forest/5 items-center cursor-pointer hover:bg-forest/5 transition-colors ${expanded === plant.id ? 'bg-cream' : ''}`}
                onClick={() => setExpanded(expanded === plant.id ? null : plant.id)}
              >
                <div className="flex items-center gap-2 font-medium text-forest-dark">
                  {plant.is_tree ? <TreePine size={15} className="text-bark shrink-0" /> : <Leaf size={15} className="text-forest-light shrink-0" />}
                  {plant.name}
                </div>
                <span className="text-sm text-forest/70">{monthLabel(plant.planting_start)}–{monthLabel(plant.planting_end)}</span>
                <span className="text-sm text-forest/70">{monthLabel(plant.harvesting_start)}–{monthLabel(plant.harvesting_end)}</span>
                <span className="text-sm text-forest/70">{plant.height} cm</span>
                <span className="flex items-center gap-1 text-sm text-forest/70"><Droplets size={12} className="text-blue-400" />{plant.water} ml</span>
                <ChevronDown size={16} className={`text-forest/40 transition-transform ${expanded === plant.id ? 'rotate-180' : ''}`} />
              </div>

              {expanded === plant.id && (
                <div className="px-6 py-4 bg-soil/60 border-b border-forest/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-forest/50">Spread</span><p className="text-forest-dark font-medium">{plant.spread} cm</p></div>
                  <div><span className="text-forest/50">Shadow</span><p><BoolBadge value={plant.shadow} trueLabel="Likes shade" falseLabel="Full sun" /></p></div>
                  <div><span className="text-forest/50">Body water</span><p><BoolBadge value={plant.body_water} trueLabel="Tolerates" falseLabel="Avoid" /></p></div>
                  <div><span className="text-forest/50">Type</span><p><BoolBadge value={plant.is_tree} trueLabel="Tree" falseLabel="Plant" /></p></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
