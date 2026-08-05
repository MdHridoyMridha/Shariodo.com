import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

import SharidoLogo from '../components/SharidoLogo';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await signIn({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      const adminEmails = ['hridoyhs369@gmail.com', 'hsshathi3@gmail.com'];
      if (adminEmails.includes(email.toLowerCase())) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  const fillAdminCredentials = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-neutral-200 max-w-md w-full space-y-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <SharidoLogo variant="full" theme="dark" className="justify-center" />
          <h1 className="text-xl font-black text-neutral-900 tracking-tight pt-2">Welcome Back</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Sign in to access your handcrafted acquisitions and saved wishlist
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@sharido.com"
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl pl-10 font-medium"
              />
              <Mail size={16} className="absolute left-3 top-3.5 text-neutral-400" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl pl-10 font-medium"
              />
              <Lock size={16} className="absolute left-3 top-3.5 text-neutral-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-neutral-900 text-amber-200 rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fillAdminCredentials('hridoyhs369@gmail.com')}
            className="px-2.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-[11px] font-bold hover:bg-amber-100 transition-all"
          >
            🔑 Fill Admin (hridoyhs369)
          </button>
          <button
            type="button"
            onClick={() => fillAdminCredentials('hsshathi3@gmail.com')}
            className="px-2.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-[11px] font-bold hover:bg-amber-100 transition-all"
          >
            🔑 Fill Admin (hsshathi3)
          </button>
        </div>

        <p className="text-center text-xs text-neutral-500 font-medium">
          New to Sharido?{' '}
          <Link to="/signup" className="font-bold text-amber-900 underline">
            Sign Up Account
          </Link>
        </p>
      </div>
    </div>
  );
}
