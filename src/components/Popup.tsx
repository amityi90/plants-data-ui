import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  icon: ReactNode;
  title: string;
  message?: string;
  accentClass: string;
  onClose: () => void;
}

export default function Popup({ icon, title, message, accentClass, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm animate-backdrop-fade"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-cream rounded-2xl shadow-2xl border border-forest/10 p-8 w-full max-w-sm animate-pop-in"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-forest/60 hover:text-forest transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className={`flex justify-center mb-4 animate-icon-pop ${accentClass}`}>
          {icon}
        </div>

        <h3
          className="text-2xl text-forest-dark m-0 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>
        {message && (
          <p className="text-sm text-forest/70 m-0 mt-2 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
