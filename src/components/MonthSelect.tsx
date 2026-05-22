const MONTHS = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

interface Props {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function MonthSelect({ id, value, onChange, className = '' }: Props) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className={`w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2 text-sm text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all ${className}`}
    >
      {MONTHS.map(m => (
        <option key={m.value} value={m.value}>{m.label}</option>
      ))}
    </select>
  );
}

export function monthLabel(value: number): string {
  return MONTHS[value - 1]?.label ?? String(value);
}
