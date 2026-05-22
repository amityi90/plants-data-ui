import { useState } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'full';

interface Props {
  url: string | null;
  name: string;
  size?: Size;
  className?: string;
}

const SIZE_MAP: Record<Size, string> = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-40 h-40',
  full: 'w-full h-full',
};

const LEAF_SIZE: Record<Size, number> = {
  sm: 24,
  md: 48,
  lg: 80,
  full: 96,
};

function Fallback({ size }: { size: Size }) {
  const dim = LEAF_SIZE[size];
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background:
          'linear-gradient(135deg, rgba(82,183,136,0.18) 0%, rgba(167,201,87,0.22) 100%)',
      }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 3C10 3 4 12 4 20c0 6 4 10 9 11 0-5 2-10 5-14-1 4-1 9 1 14 5-1 9-5 9-11 0-8-6-17-10-17z"
          fill="#52b788"
          opacity="0.6"
        />
        <path
          d="M18 17c0 5-1 10-2 15"
          stroke="#2d6a4f"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

export default function PlantImage({ url, name, size = 'md', className = '' }: Props) {
  const [errored, setErrored] = useState(false);
  const sizeClass = size === 'full' ? '' : SIZE_MAP[size];

  return (
    <div className={`relative overflow-hidden rounded-xl ring-1 ring-forest/10 ${sizeClass} ${className}`}>
      {url && !errored ? (
        <img
          src={url}
          alt={name}
          loading="lazy"
          onError={() => setErrored(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <Fallback size={size} />
      )}
    </div>
  );
}
