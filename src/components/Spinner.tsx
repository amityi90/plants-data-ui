interface Props {
  size?: number;
  className?: string;
}

export default function Spinner({ size = 24, className = '' }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-forest/20 border-t-forest ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function CenteredSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-forest/60">
      <Spinner size={32} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
