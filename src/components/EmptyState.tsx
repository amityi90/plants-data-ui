import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      {icon && <div className="text-forest/40">{icon}</div>}
      <p className="text-base font-medium text-forest-dark m-0">{title}</p>
      {subtitle && <p className="text-sm text-forest/50 max-w-md m-0">{subtitle}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
