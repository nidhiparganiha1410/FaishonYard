import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, LogOut, Settings } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setUser({ ...user, profile: profileData });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-serif text-2xl animate-pulse">Loading Profile...</div>;
    }

    return (
        <main className="min-h-screen bg-brand-white pt-24 pb-32">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12">My Account</h1>

                <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-black/5 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-black/5 pb-8 mb-8">
                        <div className="w-32 h-32 rounded-full bg-brand-gray border flex-shrink-0 overflow-hidden">
                            {user?.profile?.avatar_url ? (
                                <ImageWithFallback src={user.profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-full h-full p-6 text-black/20" />
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-serif font-bold mb-2">{user?.profile?.username || 'User'}</h2>
                            <p className="text-black/50 text-sm mb-4">{user?.email}</p>
                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                <span className="px-3 py-1 bg-brand-gray text-[10px] font-bold uppercase tracking-widest rounded-full text-black/60">
                                    {user?.profile?.role || 'user'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <a href="/saved" className="flex items-center justify-between p-4 bg-brand-gray/30 hover:bg-brand-gray rounded-xl transition-colors group">
                            <span className="text-sm font-bold uppercase tracking-widest text-black/70 group-hover:text-black">Saved Articles</span>
                            <span className="text-brand-accent">→</span>
                        </a>
                        {user?.profile?.role === 'admin' && (
                            <a href="/admin" className="flex items-center justify-between p-4 bg-brand-gray/30 hover:bg-brand-gray rounded-xl transition-colors group">
                                <span className="text-sm font-bold uppercase tracking-widest text-black/70 group-hover:text-brand-accent flex items-center"><Settings className="w-4 h-4 mr-2" /> Admin Dashboard</span>
                                <span className="text-brand-accent">→</span>
                            </a>
                        )}
                        <button
                            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
                            className="w-full flex items-center justify-center p-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest mt-8"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Log Out
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
