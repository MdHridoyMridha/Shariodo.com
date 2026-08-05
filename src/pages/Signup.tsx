import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react';

import SharidoLogo from '../components/SharidoLogo';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'artisan'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            email,
            role,
          });
        } catch (e) {
          console.warn('Profile upsert warning:', e);
        }
      }
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-neutral-200 max-w-md w-full space-y-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <SharidoLogo variant="full" theme="dark" className="justify-center" />
          <h1 className="text-xl font-black text-neutral-900 tracking-tight pt-2">Create an Account</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Sign up to place orders, track shipments, and save items
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl pl-10 font-medium text-neutral-900"
              />
              <User size={16} className="absolute left-3 top-3.5 text-neutral-400" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl pl-10 font-medium text-neutral-900"
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
                placeholder="At least 6 characters"
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl pl-10 font-medium text-neutral-900"
              />
              <Lock size={16} className="absolute left-3 top-3.5 text-neutral-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-neutral-900 text-amber-200 rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? 'Creating Account...' : 'Sign Up Account'} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-amber-900 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
