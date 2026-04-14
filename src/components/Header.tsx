import { useState } from 'react';
import { Menu, User, Activity, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeafLogo from './LeafLogo';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-cream/90 backdrop-blur-md border-b border-forest/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <LeafLogo />

          <div className="flex items-center gap-3">
            {/* User button */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest/20 text-forest-dark hover:bg-forest/10 transition-colors text-sm"
                aria-label="User menu"
              >
                <User size={16} className="text-forest" />
                {user ? <span className="hidden sm:inline max-w-24 truncate">{user.email.split('@')[0]}</span> : <span className="hidden sm:inline">Account</span>}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-cream border border-forest/20 shadow-lg overflow-hidden">
                  {user ? (
                    <>
                      <p className="px-4 py-2 text-xs text-forest/60 border-b border-forest/10 truncate">{user.email}</p>
                      <button
                        onClick={() => { navigate('/my-activity'); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-forest-dark hover:bg-forest/10 transition-colors"
                      >
                        <Activity size={15} className="text-forest" />
                        My Activity
                      </button>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-terra hover:bg-terra/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Log out
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

            {/* Hamburger */}
            <button
              onClick={() => setNavOpen(true)}
              className="p-2 rounded-full hover:bg-forest/10 transition-colors text-forest-dark"
              aria-label="Open menu"
            >
              <Menu size={22} />
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
