import type { ReactNode } from 'react';

interface Props {
  value: number | string;
  label: string;
  icon?: ReactNode;
}

export default function StatTile({ value, label, icon }: Props) {
  return (
    <div className="bg-white/70 border border-forest/10 rounded-2xl shadow-sm p-5 flex items-center gap-4">
      {icon && (
        <div className="shrink-0 w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p
          className="text-3xl text-forest-dark m-0 leading-none"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
        >
          {value}
        </p>
        <p className="text-sm text-forest/60 m-0 mt-1">{label}</p>
      </div>
    </div>
  );
}
