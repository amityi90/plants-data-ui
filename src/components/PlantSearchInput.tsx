import { useState, useRef, useEffect } from 'react';
import { X as XIcon } from 'lucide-react';
import { usePlants } from '../context/PlantsContext';
import type { Plant } from '../types';

interface Props {
  value: number | null;
  onChange: (plant: Plant | null) => void;
  exclude?: number | null;
  placeholder?: string;
  id?: string;
}

export default function PlantSearchInput({ value, onChange, exclude, placeholder = 'Search plant…', id }: Props) {
  const { plants } = usePlants();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = plants.find(p => p.id === value) ?? null;

  const filtered = query.length > 0
    ? plants.filter(p => p.id !== exclude && p.name.toLowerCase().includes(query.toLowerCase()))
    : plants.filter(p => p.id !== exclude);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(plant: Plant) {
    onChange(plant);
    setQuery('');
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setQuery('');
  }

  return (
    <div ref={containerRef} className="relative">
      {selected && !open ? (
        <div className="flex items-center justify-between w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2 text-sm text-forest-dark">
          <span className="font-medium">{selected.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-forest/55 hover:text-terra hover:bg-terra/10 rounded-full p-1 transition-colors"
            aria-label="Clear"
          >
            <XIcon size={14} />
          </button>
        </div>
      ) : (
        <input
          id={id}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2 text-sm text-forest-dark placeholder-forest/35 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
        />
      )}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl card-soft shadow-lg p-1">
          {filtered.slice(0, 50).map(plant => (
            <li
              key={plant.id}
              onMouseDown={() => handleSelect(plant)}
              className="px-3 py-2 cursor-pointer rounded-lg hover:bg-forest/10 text-sm text-forest-dark transition-colors"
            >
              {plant.name}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl card-soft px-3 py-2 text-sm text-forest/55 shadow-lg">
          No plants found
        </div>
      )}
    </div>
  );
}
