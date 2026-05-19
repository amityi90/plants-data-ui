import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-cream rounded-2xl shadow-2xl border border-forest/10 p-6 w-full max-w-sm animate-fade-in">
        <h3 className="text-xl text-forest-dark m-0 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h3>
        {body && <p className="text-sm text-forest/70 m-0 mb-5">{body}</p>}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-forest hover:bg-forest/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-cream transition-colors ${
              destructive
                ? 'bg-terra hover:bg-terra/90'
                : 'bg-forest hover:bg-forest-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
