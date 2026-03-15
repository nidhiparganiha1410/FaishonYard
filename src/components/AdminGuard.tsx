import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Admin check failed:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-2xl animate-pulse text-brand-black">
        Verifying Credentials...
      </div>
    );
  }

  if (isAdmin === false) {
    // Redirect or show Access Denied
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center px-4 bg-brand-gray/30">
        <div className="max-w-md w-full bg-white p-12 rounded-[2rem] border border-black/5 shadow-2xl text-center">
            <h1 className="text-4xl font-serif font-bold mb-4 text-red-500">Access Denied</h1>
            <p className="text-black/50 text-sm uppercase tracking-widest mb-8">This archive is restricted to authorized personnel only.</p>
            <div className="space-y-4">
                <a href="/login" className="block w-full py-4 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black/80 transition-all">
                    Sign In as Admin
                </a>
                <a href="/" className="block w-full py-4 border border-black/10 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-gray transition-all">
                    Return to Home
                </a>
            </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
