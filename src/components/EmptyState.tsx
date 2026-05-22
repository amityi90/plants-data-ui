import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center animate-fade-in-up">
      {icon && (
        <div className="relative mb-1">
          <span className="absolute -inset-5 rounded-full bg-forest/5 blur-2xl" aria-hidden />
          <span className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-forest-light/20 to-moss/30 ring-1 ring-forest/15 text-forest animate-drift">
            {icon}
          </span>
        </div>
      )}
      <p className="serif text-2xl font-semibold text-forest-dark m-0 tracking-tight">{title}</p>
      {subtitle && <p className="text-sm text-forest/55 max-w-md m-0 leading-relaxed">{subtitle}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
