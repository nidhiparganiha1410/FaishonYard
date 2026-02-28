import React from 'react';
import { Instagram, Twitter, Facebook, ArrowRight, Linkedin } from 'lucide-react';

export default function Footer() {
  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <footer className="bg-brand-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-serif font-bold tracking-tighter uppercase mb-6">
              Fashion Yard
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              The definitive guide to luxury minimalism, editorial fashion, and timeless style.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/jeet.parganiha.5" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/jeetparganiha/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="https://x.com/jeetparganiha" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/jeet-parganiha-b92305116/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Categories</h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="/shop" onClick={(e) => navigate(e, '/shop')} className="hover:text-white transition-colors">Shop</a></li>
              <li><a href="/" onClick={(e) => navigate(e, '/')} className="hover:text-white transition-colors">Runway</a></li>
              <li><a href="/" onClick={(e) => navigate(e, '/')} className="hover:text-white transition-colors">Street Style</a></li>
              <li><a href="/" onClick={(e) => navigate(e, '/')} className="hover:text-white transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Company</h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="/about" onClick={(e) => navigate(e, '/about')} className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" onClick={(e) => navigate(e, '/contact')} className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/affiliate-disclosure" onClick={(e) => navigate(e, '/affiliate-disclosure')} className="hover:text-white transition-colors">Affiliate Disclosure</a></li>
              <li><a href="/privacy-policy" onClick={(e) => navigate(e, '/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h3>
            <p className="text-white/60 text-sm mb-6">
              Get the latest editorial updates delivered to your inbox.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-full hover:bg-white/80 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 uppercase tracking-widest">
          <p>© 2026 Fashion Yard. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">Crafted for the discerning eye.</p>
        </div>
      </div>
    </footer>
  );
}
