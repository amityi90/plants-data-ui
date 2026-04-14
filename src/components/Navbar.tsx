import { X, Leaf, Plus, GitBranch, Info, List, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const navLinks = [
  { to: '/add-plant', label: 'Add Plant', icon: <Plus size={18} /> },
  { to: '/add-relationship', label: 'Add Relationship', icon: <GitBranch size={18} /> },
  { to: '/plants', label: 'See All Plants', icon: <List size={18} /> },
  { to: '/about', label: 'About', icon: <Info size={18} /> },
];

export default function Navbar({ open, onClose, onLoginClick, onRegisterClick }: Props) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-forest-dark/30 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <nav
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-cream shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-forest/10">
          <div className="flex items-center gap-2 text-forest-dark">
            <Leaf size={20} className="text-forest" />
            <span className="font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Menu</span>
          </div>
          <button onClick={onClose} className="text-forest/60 hover:text-forest transition-colors" aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-forest-dark hover:bg-forest/10 transition-colors font-medium"
            >
              <span className="text-forest">{link.icon}</span>
              {link.label}
            </Link>
          ))}

          {user ? (
            <Link
              to="/my-activity"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-forest-dark hover:bg-forest/10 transition-colors font-medium"
            >
              <span className="text-forest"><Activity size={18} /></span>
              My Activity
            </Link>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-forest/30 cursor-not-allowed font-medium">
              <span><Activity size={18} /></span>
              My Activity
              <span className="ml-auto text-xs bg-forest/10 px-2 py-0.5 rounded-full">login required</span>
            </div>
          )}
        </div>

        {/* Auth buttons */}
        <div className="px-4 py-5 border-t border-forest/10 flex flex-col gap-2">
          {user ? (
            <>
              <p className="text-sm text-forest/60 text-center mb-1">Signed in as <span className="text-forest font-medium">{user.email}</span></p>
              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full rounded-xl border border-forest/30 py-2.5 text-forest-dark hover:bg-forest/10 transition-colors font-medium"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { onLoginClick(); onClose(); }}
                className="w-full rounded-xl bg-forest py-2.5 text-cream font-semibold hover:bg-forest-dark transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => { onRegisterClick(); onClose(); }}
                className="w-full rounded-xl border border-forest py-2.5 text-forest font-semibold hover:bg-forest/10 transition-colors"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
