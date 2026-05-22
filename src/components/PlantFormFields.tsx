import MonthSelect from './MonthSelect';
import type { NewPlant } from '../types';

interface Props {
  value: NewPlant;
  onChange: (next: NewPlant) => void;
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-forest-dark">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-forest shadow-inner shadow-forest-dark/30' : 'bg-forest/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

export default function PlantFormFields({ value, onChange }: Props) {
  function set<K extends keyof NewPlant>(key: K, v: NewPlant[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5" htmlFor="name">
          Plant name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={value.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Tomato, Basil, Lavender…"
          className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2.5 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5" htmlFor="image_url">
          Image URL <span className="ml-1 normal-case font-normal text-forest/40">(optional)</span>
        </label>
        <input
          id="image_url"
          type="url"
          value={value.image_url ?? ''}
          onChange={(e) => set('image_url', e.target.value || null)}
          placeholder="https://…"
          className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2.5 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
        />
      </div>

      {/* Planting season */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5">Planting season</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-forest/55 mb-1" htmlFor="planting_start">From</label>
            <MonthSelect id="planting_start" value={value.planting_start} onChange={(v) => set('planting_start', v)} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-forest/55 mb-1" htmlFor="planting_end">To</label>
            <MonthSelect id="planting_end" value={value.planting_end} onChange={(v) => set('planting_end', v)} />
          </div>
        </div>
      </div>

      {/* Harvesting season */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5">Harvesting season</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-forest/55 mb-1" htmlFor="harvesting_start">From</label>
            <MonthSelect id="harvesting_start" value={value.harvesting_start} onChange={(v) => set('harvesting_start', v)} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-forest/55 mb-1" htmlFor="harvesting_end">To</label>
            <MonthSelect id="harvesting_end" value={value.harvesting_end} onChange={(v) => set('harvesting_end', v)} />
          </div>
        </div>
      </div>

      {/* Water + dimensions */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-forest/55 mb-1" htmlFor="water">Water <span className="normal-case text-forest/40">(ml/day)</span></label>
          <input
            id="water"
            type="number"
            min={0}
            value={value.water}
            onChange={(e) => set('water', Number(e.target.value))}
            className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-forest/55 mb-1" htmlFor="height">Height <span className="normal-case text-forest/40">(cm)</span></label>
          <input
            id="height"
            type="number"
            min={1}
            value={value.height}
            onChange={(e) => set('height', Number(e.target.value))}
            className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-forest/55 mb-1" htmlFor="spread">Spread <span className="normal-case text-forest/40">(cm)</span></label>
          <input
            id="spread"
            type="number"
            min={1}
            value={value.spread}
            onChange={(e) => set('spread', Number(e.target.value))}
            className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/40 transition-all"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3 bg-cream-dark/40 rounded-2xl p-4 ring-1 ring-forest/10">
        <Toggle label="Likes shade / shadow" checked={value.shadow} onChange={(v) => set('shadow', v)} />
        <Toggle label="Can have water on leaves" checked={value.body_water} onChange={(v) => set('body_water', v)} />
        <Toggle label="Is a tree" checked={value.is_tree} onChange={(v) => set('is_tree', v)} />
      </div>
    </div>
  );
}
