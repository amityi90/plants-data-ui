import { useState } from 'react';
import { Sprout } from 'lucide-react';
import MonthSelect from '../components/MonthSelect';
import { addPlant } from '../api/plants';
import { usePlants } from '../context/PlantsContext';
import type { NewPlant } from '../types';

const defaultForm: NewPlant = {
  name: '',
  planting_start: 3,
  planting_end: 5,
  harvesting_start: 6,
  harvesting_end: 9,
  water: 250,
  shadow: false,
  height: 50,
  spread: 30,
  body_water: false,
  is_tree: false,
};

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-forest-dark">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${checked ? 'bg-forest' : 'bg-forest/20'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </label>
  );
}

export default function AddPlantForm() {
  const [form, setForm] = useState<NewPlant>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { refresh } = usePlants();

  function set<K extends keyof NewPlant>(key: K, value: NewPlant[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await addPlant(form);
      setSuccess(`"${form.name}" was added successfully!`);
      setForm(defaultForm);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add plant');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Sprout size={28} className="text-forest" />
        <h1 className="text-3xl text-forest-dark m-0">Add a Plant</h1>
      </div>

      {success && (
        <div className="mb-6 rounded-xl bg-forest/10 border border-forest/20 px-4 py-3 text-forest font-medium">{success}</div>
      )}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/60 rounded-2xl border border-forest/10 shadow-sm p-6 flex flex-col gap-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-forest-dark mb-1" htmlFor="name">Plant name *</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Tomato, Basil, Lavender..."
            className="w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/50"
          />
        </div>

        {/* Planting season */}
        <div>
          <p className="text-sm font-medium text-forest-dark mb-2">Planting season</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-forest/70 mb-1" htmlFor="planting_start">From</label>
              <MonthSelect id="planting_start" value={form.planting_start} onChange={v => set('planting_start', v)} />
            </div>
            <div>
              <label className="block text-xs text-forest/70 mb-1" htmlFor="planting_end">To</label>
              <MonthSelect id="planting_end" value={form.planting_end} onChange={v => set('planting_end', v)} />
            </div>
          </div>
        </div>

        {/* Harvesting season */}
        <div>
          <p className="text-sm font-medium text-forest-dark mb-2">Harvesting season</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-forest/70 mb-1" htmlFor="harvesting_start">From</label>
              <MonthSelect id="harvesting_start" value={form.harvesting_start} onChange={v => set('harvesting_start', v)} />
            </div>
            <div>
              <label className="block text-xs text-forest/70 mb-1" htmlFor="harvesting_end">To</label>
              <MonthSelect id="harvesting_end" value={form.harvesting_end} onChange={v => set('harvesting_end', v)} />
            </div>
          </div>
        </div>

        {/* Water + dimensions */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-forest/70 mb-1" htmlFor="water">Water (ml/day)</label>
            <input
              id="water"
              type="number"
              min={0}
              value={form.water}
              onChange={e => set('water', Number(e.target.value))}
              className="w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/50"
            />
          </div>
          <div>
            <label className="block text-xs text-forest/70 mb-1" htmlFor="height">Height (cm)</label>
            <input
              id="height"
              type="number"
              min={1}
              value={form.height}
              onChange={e => set('height', Number(e.target.value))}
              className="w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/50"
            />
          </div>
          <div>
            <label className="block text-xs text-forest/70 mb-1" htmlFor="spread">Spread (cm)</label>
            <input
              id="spread"
              type="number"
              min={1}
              value={form.spread}
              onChange={e => set('spread', Number(e.target.value))}
              className="w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/50"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 bg-soil rounded-xl p-4 border border-forest/10">
          <Toggle label="Likes shade / shadow" checked={form.shadow} onChange={v => set('shadow', v)} />
          <Toggle label="Can have water on leaves" checked={form.body_water} onChange={v => set('body_water', v)} />
          <Toggle label="Is a tree" checked={form.is_tree} onChange={v => set('is_tree', v)} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-forest py-3 text-cream font-semibold text-base hover:bg-forest-dark transition-colors disabled:opacity-60 mt-1"
        >
          {loading ? 'Adding...' : 'Add Plant'}
        </button>
      </form>
    </div>
  );
}
