import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import Popup from '../components/Popup';

type Variant = 'success' | 'error' | 'info';

export interface PopupOptions {
  title: string;
  message?: string;
  variant?: Variant;
  icon?: ReactNode;
  autoDismissMs?: number;
}

interface PopupContextValue {
  showPopup: (options: PopupOptions) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextValue | null>(null);

const ICON_SIZE = 64;

const VARIANT_DEFAULTS: Record<Variant, { icon: ReactNode; accentClass: string }> = {
  success: { icon: <CheckCircle size={ICON_SIZE} />, accentClass: 'text-forest' },
  error: { icon: <AlertCircle size={ICON_SIZE} />, accentClass: 'text-terra' },
  info: { icon: <Info size={ICON_SIZE} />, accentClass: 'text-forest-light' },
};

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<PopupOptions | null>(null);
  const dismissTimerRef = useRef<number | null>(null);

  const hidePopup = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setPopup(null);
  }, []);

  const showPopup = useCallback(
    (options: PopupOptions) => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      setPopup(options);
      if (options.autoDismissMs && options.autoDismissMs > 0) {
        dismissTimerRef.current = window.setTimeout(() => {
          dismissTimerRef.current = null;
          setPopup(null);
        }, options.autoDismissMs);
      }
    },
    [],
  );

  useEffect(() => {
    if (!popup) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') hidePopup();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [popup, hidePopup]);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  const variant = popup?.variant ?? 'success';
  const defaults = VARIANT_DEFAULTS[variant];

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup &&
        createPortal(
          <Popup
            icon={popup.icon ?? defaults.icon}
            title={popup.title}
            message={popup.message}
            accentClass={defaults.accentClass}
            onClose={hidePopup}
          />,
          document.body,
        )}
    </PopupContext.Provider>
  );
}

export function usePopup(): PopupContextValue {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('usePopup must be used inside PopupProvider');
  return ctx;
}
