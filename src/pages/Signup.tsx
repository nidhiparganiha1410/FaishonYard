import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Create profile record
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username,
          role: 'user',
        });
      }
      alert('Check your email for the confirmation link!');
      window.location.href = '/login';
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Join Fashion Yard</h1>
          <p className="text-black/40 text-sm uppercase tracking-widest">Create an account to save articles and join the conversation</p>
        </div>

        <div className="bg-white border border-black/5 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-black/5">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-brand-gray border border-transparent focus:border-black/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all"
                  placeholder="fashion_enthusiast"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-gray border border-transparent focus:border-black/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-gray border border-transparent focus:border-black/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center group"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] uppercase tracking-widest text-black/40">
            Already have an account? <a href="/login" className="text-black font-bold hover:underline">Login</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
