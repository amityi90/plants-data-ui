import { useEffect } from 'react';
import { X, Leaf, Plus, GitBranch, Info, List, Activity, Network, LogIn, UserPlus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof Leaf;
  end?: boolean;
}

const browseLinks: NavItem[] = [
  { to: '/plants',    label: 'All plants',   icon: List,    end: true },
  { to: '/relations', label: 'Relationships', icon: Network },
];

const contributeLinks: NavItem[] = [
  { to: '/add-plant',        label: 'Add a plant',        icon: Plus },
  { to: '/add-relationship', label: 'Add a relationship', icon: GitBranch },
];

export default function Navbar({ open, onClose, onLoginClick, onRegisterClick }: Props) {
  const { user, logout } = useAuth();
  const { showPopup } = usePopup();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function handleSignOut() {
    logout();
    onClose();
    showPopup({
      variant: 'info',
      title: 'Signed out',
      message: 'See you soon.',
    });
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-forest-dark/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[88vw] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          background: 'linear-gradient(180deg, #fefae0 0%, #fdf3c0 100%)',
          borderLeft: '1px solid rgba(45,106,79,0.12)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        {/* Brand row */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-forest/10">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 no-underline">
            <Leaf size={22} className="text-forest" />
            <span className="serif text-lg font-semibold text-forest-dark leading-none">Plants Data</span>
          </Link>
          <button
            onClick={onClose}
            className="text-forest/55 hover:text-forest hover:bg-forest/10 rounded-full p-1.5 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <NavGroup heading="Browse" items={browseLinks} onClose={onClose} />
          <NavGroup heading="Contribute" items={contributeLinks} onClose={onClose} />

          <div className="mb-5 last:mb-0">
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">
              You
            </p>
            <ul className="flex flex-col gap-0.5">
              <li>
                {user ? (
                  <NavLink
                    to="/my-activity"
                    onClick={onClose}
                    className={({ isActive }) => itemClass(isActive)}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <ActiveBar />}
                        <Activity size={18} className={isActive ? 'text-forest' : 'text-forest/55'} />
                        <span className="flex-1">My activity</span>
                      </>
                    )}
                  </NavLink>
                ) : (
                  <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-forest/35">
                    <Activity size={18} />
                    <span className="flex-1">My activity</span>
                    <span className="text-[10px] bg-forest/10 px-2 py-0.5 rounded-full text-forest/55">
                      login required
                    </span>
                  </span>
                )}
              </li>
              <li>
                <NavLink
                  to="/about"
                  onClick={onClose}
                  className={({ isActive }) => itemClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <ActiveBar />}
                      <Info size={18} className={isActive ? 'text-forest' : 'text-forest/55'} />
                      <span className="flex-1">About</span>
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-forest/10 px-5 py-4">
          {user ? (
            <>
              <p className="text-xs text-forest/55 mb-3 truncate">
                <span className="text-forest/40">Signed in as </span>
                <span className="text-forest-dark">{user.email}</span>
              </p>
              <button
                onClick={handleSignOut}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-forest/20 bg-white/60 px-4 py-2.5 text-sm font-medium text-forest-dark hover:bg-forest/10 hover:border-forest/30 transition-all"
              >
                <X size={15} className="text-terra" />
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onLoginClick(); onClose(); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-forest to-forest-dark px-4 py-2.5 text-sm text-cream font-semibold hover:from-forest-dark hover:to-forest-dark transition-all shadow-md shadow-forest/20"
              >
                <LogIn size={15} />
                Log in
              </button>
              <button
                onClick={() => { onRegisterClick(); onClose(); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-forest/25 bg-white/60 px-4 py-2.5 text-sm font-medium text-forest-dark hover:bg-forest/10 transition-all"
              >
                <UserPlus size={15} />
                Register
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function NavGroup({ heading, items, onClose }: { heading: string; items: NavItem[]; onClose: () => void }) {
  return (
    <div className="mb-5">
      <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">
        {heading}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => itemClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <ActiveBar />}
                    <Icon size={18} className={isActive ? 'text-forest' : 'text-forest/55'} />
                    <span className="flex-1">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ActiveBar() {
  return <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-forest" aria-hidden />;
}

function itemClass(isActive: boolean): string {
  return `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all no-underline ${
    isActive
      ? 'bg-forest/10 text-forest-dark font-semibold'
      : 'text-forest-dark/75 hover:text-forest-dark hover:bg-forest/5'
  }`;
}
