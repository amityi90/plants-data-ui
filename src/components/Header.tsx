import { useState, useEffect, useRef } from 'react';
import { Menu, User, Activity, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeafLogo from './LeafLogo';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { showPopup } = usePopup();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  function handleSignOut() {
    logout();
    setUserMenuOpen(false);
    showPopup({
      variant: 'info',
      title: 'Signed out',
      message: 'See you soon.',
    });
  }

  return (
    <>
      <header className="sticky top-0 z-30 w-full card-glass border-b border-forest/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 h-[68px] flex items-center justify-between gap-3">
          <LeafLogo />

          <div className="flex items-center gap-2 ml-auto">
            {/* User pill */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-1.5 rounded-full border border-forest/20 bg-cream/70 px-3 py-1.5 text-sm text-forest-dark hover:bg-forest/10 hover:border-forest/30 transition-all"
                aria-label="User menu"
              >
                <User size={15} className="text-forest" />
                <span className="hidden sm:inline max-w-[7rem] truncate">
                  {user ? user.email.split('@')[0] : 'Account'}
                </span>
                <ChevronDown size={13} className={`text-forest/55 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl card-soft overflow-hidden animate-fade-in">
                  {user ? (
                    <>
                      <p className="px-4 py-3 text-xs text-forest/60 border-b border-forest/10 truncate">
                        Signed in as<br />
                        <span className="text-forest-dark font-medium">{user.email}</span>
                      </p>
                      <button
                        onClick={() => { navigate('/my-activity'); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-forest-dark hover:bg-forest/10 transition-colors text-left"
                      >
                        <Activity size={15} className="text-forest" />
                        My Activity
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-terra hover:bg-terra/10 transition-colors text-left"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setAuthModal('login'); setUserMenuOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm text-forest-dark hover:bg-forest/10 transition-colors text-left"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => { setAuthModal('register'); setUserMenuOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm text-forest-dark hover:bg-forest/10 transition-colors text-left"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger menu */}
            <button
              onClick={() => setNavOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-forest/20 bg-cream/70 text-forest-dark hover:bg-forest/10 hover:border-forest/30 transition-all"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <Navbar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
      />

      {authModal && (
        <AuthModal
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  );
}
