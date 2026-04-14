import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register';

interface Props {
  initialMode?: Mode;
  onClose: () => void;
}

export default function AuthModal({ initialMode = 'login', onClose }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else {
        await register(email, password);
        setSuccess('Registered! Please log in.');
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-cream shadow-2xl border border-forest/20 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-forest/60 hover:text-forest transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl mb-6 text-center text-forest-dark" style={{ fontFamily: "'Playfair Display', serif" }}>
          {mode === 'login' ? 'Welcome back' : 'Join us'}
        </h2>

        {success && (
          <p className="mb-4 text-sm text-center text-forest bg-forest/10 rounded-lg px-3 py-2">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-forest-dark mb-1" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-forest/30 bg-white px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-forest-dark mb-1" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-forest/30 bg-white px-3 py-2 text-forest-dark focus:outline-none focus:ring-2 focus:ring-forest/50"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-forest py-2.5 text-cream font-semibold hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {loading ? '...' : mode === 'login' ? 'Log in' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-forest/70">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }} className="text-terra hover:underline">Register</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-terra hover:underline">Log in</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
