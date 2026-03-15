import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User, Bookmark, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Category } from '../types';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="group flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src="/assets/logo.png" 
                  alt="FaishonYard Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(229,77,22,0.3)]"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-serif font-black tracking-tighter uppercase text-brand-black group-hover:text-brand-accent transition-colors leading-none">
                  FaishonYard
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-black/30 group-hover:text-brand-accent/50 transition-colors mt-0.5">
                  Editorial • Lux
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a
              href="/shop"
              className="text-sm font-medium uppercase tracking-widest text-[#EA580C] hover:text-[#C2410C] transition-colors mr-2"
            >
              Shop
            </a>
            {categories.slice(0, 4).map((cat) => (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-sm font-medium uppercase tracking-widest hover:text-black/60 transition-colors"
              >
                {cat.name}
              </a>
            ))}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium uppercase tracking-widest hover:text-black/60 transition-colors">
                More <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {/* Mega Menu Placeholder */}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-brand-gray border border-black/5 overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-1.5 text-black/40" />
                    )}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-brand-gray">
                    <User className="mr-2 w-4 h-4" /> Profile
                  </a>
                  <a href="/saved" className="flex items-center px-4 py-2 text-sm hover:bg-brand-gray">
                    <Bookmark className="mr-2 w-4 h-4" /> Saved Posts
                  </a>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <a href="/login" className="text-sm font-medium uppercase tracking-widest">Login</a>
                <a href="/signup" className="px-4 py-2 bg-[#EA580C] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#C2410C] transition-colors">
                  Sign Up
                </a>
              </div>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-black/5 p-8 shadow-2xl"
          >
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for trends, styles, or articles..."
                className="w-full text-4xl font-serif border-none focus:ring-0 placeholder:text-black/10"
                autoFocus
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold uppercase tracking-widest">
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-black/5 overflow-hidden shadow-xl"
          >
            <nav className="flex flex-col px-4 py-6 space-y-4">
              <a href="/shop" className="text-sm font-bold uppercase tracking-widest text-[#EA580C] pb-2 border-b border-black/5">Shop</a>
              {categories.map((cat) => (
                <a key={cat.id} href={`/category/${cat.slug}`} className="text-sm font-bold uppercase tracking-widest pb-2 border-b border-black/5">
                  {cat.name}
                </a>
              ))}

              {user ? (
                <div className="pt-4 space-y-4">
                  <a href="/profile" className="flex items-center text-sm font-bold uppercase tracking-widest text-black/60"><User className="mr-3 w-4 h-4" /> Profile</a>
                  <a href="/saved" className="flex items-center text-sm font-bold uppercase tracking-widest text-black/60"><Bookmark className="mr-3 w-4 h-4" /> Saved Posts</a>
                  <button onClick={() => supabase.auth.signOut()} className="flex items-center text-sm font-bold uppercase tracking-widest text-red-600"><LogOut className="mr-3 w-4 h-4" /> Logout</button>
                </div>
              ) : (
                <div className="pt-4 flex flex-col space-y-4">
                  <a href="/login" className="text-sm font-bold uppercase tracking-widest text-black/60">Login</a>
                  <a href="/signup" className="text-sm font-bold uppercase tracking-widest text-brand-accent">Sign Up</a>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
