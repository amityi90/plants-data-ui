import type { ReactNode } from 'react';

interface Props {
  value: number | string;
  label: string;
  icon?: ReactNode;
}

export default function StatTile({ value, label, icon }: Props) {
  return (
    <div className="card-soft rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
      {icon && (
        <div className="shrink-0 w-12 h-12 rounded-xl bg-forest/10 text-forest ring-1 ring-forest/15 flex items-center justify-center transition-transform group-hover:scale-105">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="serif text-3xl font-semibold text-forest-dark m-0 leading-none tracking-tight">
          {value}
        </p>
        <p className="text-xs uppercase tracking-wider text-forest/55 m-0 mt-1.5">{label}</p>
      </div>
    </div>
  );
}
