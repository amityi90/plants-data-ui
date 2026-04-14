import { useState, useRef, useEffect } from 'react';
import { usePlants } from '../context/PlantsContext';
import type { Plant } from '../types';

interface Props {
  value: number | null;
  onChange: (plant: Plant | null) => void;
  exclude?: number | null;
  placeholder?: string;
  id?: string;
}

export default function PlantSearchInput({ value, onChange, exclude, placeholder = 'Search plant...', id }: Props) {
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
        <div className="flex items-center justify-between w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark">
          <span>{selected.name}</span>
          <button type="button" onClick={handleClear} className="text-terra hover:text-terra-light text-sm ml-2">✕</button>
        </div>
      ) : (
        <input
          id={id}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/50"
        />
      )}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-forest/20 bg-cream shadow-lg">
          {filtered.slice(0, 50).map(plant => (
            <li
              key={plant.id}
              onMouseDown={() => handleSelect(plant)}
              className="px-3 py-2 cursor-pointer hover:bg-forest/10 text-forest-dark"
            >
              {plant.name}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-forest/20 bg-cream px-3 py-2 text-forest/60 shadow-lg">
          No plants found
        </div>
      )}
    </div>
  );
}
