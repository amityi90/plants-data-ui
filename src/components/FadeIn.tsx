import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function FadeIn({ children, className = '' }: Props) {
  return <div className={`animate-fade-in ${className}`}>{children}</div>;
}
