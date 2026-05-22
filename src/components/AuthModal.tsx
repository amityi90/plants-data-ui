import { useState } from 'react';
import { X, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';
import Spinner from './Spinner';

type Mode = 'login' | 'register';

interface Props {
  initialMode?: Mode;
  onClose: () => void;
}

export default function AuthModal({ initialMode = 'login', onClose }: Props) {
  const { login, register } = useAuth();
  const { showPopup } = usePopup();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
        showPopup({ title: 'Welcome back', message: email });
      } else {
        await register(email, password);
        onClose();
        showPopup({
          title: 'Account created',
          message: 'Pending approval — you can log in once approved.',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-forest-dark/40 backdrop-blur-sm animate-backdrop-fade">
      <div className="relative w-full max-w-md card-soft rounded-3xl p-8 animate-pop-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-full p-1.5 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-forest to-forest-dark text-cream shadow-lg shadow-forest/30 mb-3">
            <Leaf size={26} />
          </span>
          <h2 className="serif text-2xl text-forest-dark m-0 tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Join us'}
          </h2>
          <p className="text-xs text-forest/55 mt-1">
            {mode === 'login' ? 'Sign in to add plants and relationships.' : 'Create an account to contribute.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-forest/20 bg-white/80 px-4 py-2.5 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-forest/20 bg-white/80 px-4 py-2.5 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all"
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <p className="text-sm text-terra text-center bg-terra/10 border border-terra/20 rounded-xl px-3 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-forest to-forest-dark py-2.5 text-cream font-semibold tracking-wide hover:from-forest-dark hover:to-forest-dark transition-all disabled:opacity-60 shadow-md shadow-forest/25 hover:shadow-lg hover:shadow-forest/35 mt-1"
          >
            {loading && <Spinner size={14} className="border-cream/30 border-t-cream" />}
            {loading ? '…' : mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-forest/60">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-terra hover:underline font-medium">Register</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-terra hover:underline font-medium">Log in</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
