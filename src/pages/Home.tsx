import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Clock, Eye, Sparkles, Navigation, Truck, CreditCard, Gift, Headphones } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Post, Product } from '../types';
import { formatDate, cn } from '../lib/utils';
import { HeroSkeleton, PostSkeleton } from '../components/Skeletons';
import CategoryShowcase from '../components/CategoryShowcase';
import BrandsSlider from '../components/BrandsSlider';
import ImageWithFallback from '../components/ImageWithFallback';

const DEMO_POSTS: Partial<Post>[] = [
  {
    id: 'demo-1',
    title: 'The Future of Digital Couture: 2026 and Beyond',
    slug: 'future-digital-couture',
    excerpt: 'Exploring how generative AI and augmented reality are redefining the luxury atelier experience.',
    featured_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    categories: { name: 'Innovation' } as any,
    view_count: 15400,
    read_time: 12,
    bullet_points: ['Generative design patterns', 'Virtual fitting rooms', 'Sustainable digital production'],
    created_at: new Date().toISOString(),
    profiles: { username: 'Elena Vance', avatar_url: 'https://i.pravatar.cc/150?u=elena' } as any
  },
  {
    id: 'demo-2',
    title: 'Quiet Luxury: The Texture of Silence',
    slug: 'quiet-luxury-texture',
    excerpt: 'Why the most powerful statements in fashion are the ones whispered through exquisite craftsmanship.',
    featured_image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
    categories: { name: 'Minimalism' } as any,
    view_count: 8200,
    read_time: 8,
    bullet_points: ['The rise of unbranded luxury', 'Textural depth over logos', 'Investment-grade materials'],
    created_at: new Date().toISOString(),
    profiles: { username: 'Julian Thorne', avatar_url: 'https://i.pravatar.cc/150?u=julian' } as any
  }
];

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (featuredPosts.length || 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredPosts.length]);

  async function fetchPosts() {
    try {
      setLoading(true);
      const [featured, trending, recent] = await Promise.all([
        supabase.from('posts').select('*, categories(*), profiles(*)').eq('is_featured', true).eq('status', 'published').limit(3),
        supabase.from('posts').select('*, categories(*)').eq('status', 'published').order('view_count', { ascending: false }).limit(6),
        supabase.from('posts').select('*, categories(*), profiles(*)').eq('status', 'published').order('created_at', { ascending: false }).limit(8)
      ]);

      if (featured.data?.length) setFeaturedPosts(featured.data as Post[]);
      else setFeaturedPosts(DEMO_POSTS as Post[]);

      if (trending.data?.length) setTrendingPosts(trending.data as Post[]);
      else setTrendingPosts(DEMO_POSTS as Post[]);

      if (recent.data?.length) setRecentPosts(recent.data as Post[]);
      else setRecentPosts([...DEMO_POSTS, ...DEMO_POSTS, ...DEMO_POSTS, ...DEMO_POSTS] as Post[]);

    } catch (error) {
      console.error('Error fetching posts:', error);
      setFeaturedPosts(DEMO_POSTS as Post[]);
      setTrendingPosts(DEMO_POSTS as Post[]);
      setRecentPosts(DEMO_POSTS as Post[]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-white">
      {/* New Hero Section based on Uploaded Design */}
      <section className="relative min-h-[100vh] w-full bg-[#181412] pt-10 pb-24 flex flex-col items-center overflow-hidden border-b border-black/5">
        {loading ? (
          <HeroSkeleton />
        ) : (
          <>
            {/* Top Navigation / Elements */}
            <div className="w-full max-w-[1600px] flex justify-between items-start px-6 md:px-12 absolute top-8 md:top-12 z-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center group cursor-pointer"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text className="text-[11px] font-bold tracking-widest fill-white">
                    <textPath href="#circlePath" startOffset="0%">learn about us through this video • </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex -space-x-3 md:-space-x-4 pt-2"
              >
                <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-[#181412] object-cover" />
                <ImageWithFallback src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-[#181412] object-cover" />
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-[#181412] bg-[#E54D16] text-white flex items-center justify-center text-xs md:text-sm font-medium z-10">+</div>
              </motion.div>
            </div>

            <div className="text-center z-10 mt-20 md:mt-16 mb-8 px-4 w-full flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#E54D16] mb-4 block">ELEVATE YOUR AESTHETIC</span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center font-serif text-[#F4F4F5] leading-[1.1] max-w-6xl mx-auto"
              >
                <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-bold tracking-tight">Elevate Your Style With</span>
                <span className="text-6xl sm:text-7xl md:text-9xl lg:text-[120px] italic font-medium text-[#E54D16] -mt-2 md:-mt-6 tracking-tighter pr-4">Bold Fashion</span>
              </motion.h1>
              <p className="mt-8 text-[#A19D9B] text-sm md:text-base font-medium tracking-wide max-w-xl text-center px-4 leading-relaxed">
                Curated insights into the future of luxury, delivered with editorial precision.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-3 md:gap-5 mt-4 md:mt-8 px-4 max-w-[1600px] w-full"
            >
              {/* Column 1 */}
              <div className="flex flex-col gap-3 md:gap-5 w-[140px] sm:w-[180px] md:w-[220px] mt-0">
                <div className="h-[200px] sm:h-[260px] md:h-[340px] w-full rounded-[1.5rem] md:rounded-[2.5rem] rounded-tr-sm md:rounded-tr-lg bg-orange-500 overflow-hidden shadow-sm group">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80" alt="Fashion 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                </div>
                <div className="h-[120px] sm:h-[140px] md:h-[180px] w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-amber-400 overflow-hidden shadow-sm group">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" alt="Fashion 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-5 w-[160px] sm:w-[200px] md:w-[260px] -mt-8 sm:mt-12 md:mt-20">
                <div className="h-[280px] sm:h-[360px] md:h-[480px] w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-emerald-500 overflow-hidden shadow-sm group">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80" alt="Fashion 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"/>
                </div>
              </div>

              {/* Column 3 (Center) */}
              <div className="flex flex-col items-center gap-4 md:gap-6 w-[160px] sm:w-[220px] md:w-[300px] mt-4 sm:mt-24 md:mt-32">
                <div className="text-[#E54D16] animate-[spin_4s_linear_infinite] opacity-80 hidden sm:block">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
                  </svg>
                </div>
                <div className="h-[180px] sm:h-[220px] md:h-[300px] w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-[#FACC15] overflow-hidden shadow-sm group">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1507537362848-9c7370b0b8c1?auto=format&fit=crop&w=600&q=80" alt="Fashion 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"/>
                </div>
                <a href="/shop" className="bg-white text-[#181412] rounded-full px-6 py-3 md:px-8 md:py-4 mt-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg text-xs md:text-sm font-bold w-full max-w-[240px] group hidden sm:flex">
                  Explore Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                </a>
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-5 w-[160px] sm:w-[200px] md:w-[260px] mt-8 sm:mt-12 md:mt-16">
                <div className="h-[280px] sm:h-[360px] md:h-[480px] w-full rounded-[1.5rem] md:rounded-[2.5rem] rounded-tl-sm md:rounded-tl-lg bg-[#60A5FA] overflow-hidden shadow-sm group">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" alt="Fashion 5" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"/>
                </div>
              </div>

              {/* Column 5 */}
              <div className="flex flex-col gap-3 md:gap-5 w-[140px] sm:w-[180px] md:w-[220px] mt-0">
                <div className="h-[160px] sm:h-[220px] md:h-[280px] w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-emerald-200 overflow-hidden shadow-sm group">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1512413914801-497d5eb45eef?auto=format&fit=crop&w=600&q=80" alt="Fashion 6" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                </div>
                <div className="h-[160px] sm:h-[180px] md:h-[240px] w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-emerald-800 overflow-hidden shadow-sm group">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=600&q=80" alt="Fashion 7" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"/>
                </div>
              </div>
              
              {/* Mobile button visible only on small screens */}
              <div className="w-full flex justify-center mt-6 sm:hidden">
                <a href="/shop" className="bg-white text-[#181412] rounded-full px-6 py-4 flex items-center justify-center gap-2 shadow-lg text-xs font-bold w-[200px] group">
                  Explore Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </section>

      {/* Free Shipping, Secured Payment, 30 Days Returns, 24/7 Support */}
      <section className="bg-white border-b border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Shipping', sub: 'For all orders over $100' },
            { icon: CreditCard, title: 'Secured Payment', sub: 'Payment cards accepted' },
            { icon: Gift, title: '30 Days Returns', sub: 'For an exchange product' },
            { icon: Headphones, title: '24/7 Support', sub: 'Contact us anytime' },
          ].map(({ icon: Icon, title, sub }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-black/5 hover:border-brand-accent/20 transition-colors"
            >
              <div className="p-3 rounded-xl bg-brand-accent/10 text-brand-accent shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-black">{title}</h3>
                <p className="text-sm text-black/50">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium Horizontal Product Slider */}
      <section className="bg-[#FFF7ED] pt-32 pb-8 overflow-hidden border-t border-black/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">The Collection</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-brand-black">Featured Objects.</h2>
          </div>
          <a href="/shop" className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-black hover:text-brand-accent transition-colors group">
            View Archive <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="flex gap-8 px-6 md:px-12 overflow-x-auto pb-12 custom-scrollbar snap-x snap-mandatory">
          {MOCK_PRODUCTS.slice(0, 5).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1 }}
              className="flex-none w-[300px] md:w-[400px] snap-center group cursor-pointer block"
              onClick={() => window.location.href = `/product/${product.slug}`}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-xl mb-6 relative bg-white/80 shadow-sm">
                <ImageWithFallback
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-sm font-bold tracking-widest text-white">{product.formatted_price}</span>
                  <button className="w-10 h-10 rounded-full bg-white text-brand-black flex items-center justify-center hover:bg-brand-accent hover:text-white transition-colors">
                    <Navigation className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/50 block mb-2">{product.category}</span>
                <h3 className="font-serif text-2xl font-bold text-brand-black group-hover:text-brand-accent transition-colors">{product.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Section (UNMODIFIED AS REQUESTED) */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6 block">Curated Selection</span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold leading-[0.9] tracking-tighter">The New Editorial Standard</h2>
          </div>
          <p className="text-black/40 text-sm max-w-xs font-medium leading-relaxed">
            Discover the stories defining the intersection of luxury, technology, and timeless minimalism.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map(i => <PostSkeleton key={i} />)
          ) : (
            <>
              {recentPosts.slice(0, 2).map((post, i) => (
                <motion.article
                  key={`${post.id}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <a href={`/blog/${post.slug}`} className="block mb-8 overflow-hidden rounded-2xl aspect-[4/5] relative">
                    <ImageWithFallback
                      src={post.featured_image || ''}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  </a>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                        {post.categories?.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-black leading-tight group-hover:text-brand-accent transition-colors">
                      <a href={`/blog/${post.slug}`}>{post.title}</a>
                    </h3>
                    <p className="text-base text-black/70 line-clamp-3 font-bold leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 flex items-center justify-between border-t border-black/5">
                      <div className="flex items-center">
                        <ImageWithFallback src={post.profiles?.avatar_url || ''} alt="" className="w-6 h-6 rounded-full mr-3 grayscale" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/60">{post.profiles?.username}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.article>
              ))}

              {/* Promo block filling the empty space beside posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#F7F6F1] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group overflow-hidden relative shadow-sm border border-black/5 w-full h-full"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-1000 group-hover:scale-150" />
                
                {/* Left Side: Text and Form */}
                <div className="relative z-10 flex-1 w-full flex flex-col justify-center sm:pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D97706] mb-2 block">Membership</span>
                  <h3 className="text-2xl lg:text-3xl xl:text-4xl font-serif font-bold leading-tight mb-2 text-[#111]">Elevate your inbox.</h3>
                  <p className="text-black/60 text-xs lg:text-sm font-medium leading-relaxed mb-6">
                    Get weekly curated editorials, VIP access to limited drops, and exclusive insights from top designers.
                  </p>

                  <form className="relative z-10 flex flex-col gap-2 w-full">
                    <input
                      type="email"
                      placeholder="YOUR EMAIL"
                      className="w-full bg-white border border-black/10 rounded-full px-5 py-3 text-brand-black text-[10px] font-bold tracking-widest focus:outline-none focus:border-brand-accent transition-colors shadow-sm"
                    />
                    <button type="button" className="w-full py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-accent transition-colors shadow-md">
                      Subscribe
                    </button>
                  </form>
                </div>

                {/* Right Side: The Offer Card (Lucrative Offer) */}
                <div className="relative z-10 w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[240px] xl:max-w-[280px] aspect-square bg-[#F7F6F1] mx-auto sm:mx-0 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-black/5 flex-shrink-0">
                  {/* Bottom-right Dark triangle */}
                  <div className="absolute right-0 bottom-0 w-[150%] h-[80%] bg-[#2B2C30] origin-bottom-right rotate-[-35deg] transform translate-y-24 translate-x-8 z-0"></div>
                  
                  {/* Bottom-left small dark triangle accent */}
                  <div className="absolute left-0 bottom-0 w-16 h-16 bg-[#2B2C30] origin-bottom-left rotate-[45deg] transform translate-y-8 -translate-x-8 z-0"></div>

                  {/* Top-left Red bracket */}
                  <div className="absolute top-3 left-3 w-8 h-12 border-t-[4px] border-l-[4px] border-[#D32F2F] z-10"></div>
                  
                  {/* Bottom-right Red rectangle */}
                  <div className="absolute bottom-4 right-10 w-1 h-2 bg-[#D32F2F] z-10"></div>
                  
                  {/* Bottom-right Dots pattern */}
                  <div className="absolute bottom-2 right-3 grid grid-cols-4 gap-1 z-10">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-[3px] h-[3px] bg-[#D32F2F]"></div>
                    ))}
                  </div>
                  
                  {/* Red stripe bottom-left */}
                  <div className="absolute -bottom-1 lg:bottom-1 left-2 flex flex-col gap-[3px] z-10 opacity-80 -rotate-45">
                     {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-6 h-[2px] bg-[#D32F2F]"></div>
                    ))}
                  </div>

                  {/* Photo of Female Model */}
                  <div className="absolute left-[8%] top-[12%] w-[60%] h-[75%] z-20 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] bg-gray-200 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" 
                      alt="Stylish Casual Female Fashion" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Diagonal frosted overlay for "75% OFF" */}
                  <div className="absolute bottom-[20px] -left-[20px] w-[150%] h-[80px] bg-white/60 backdrop-blur-md -rotate-[30deg] z-30 shadow-sm"></div>
                  
                  {/* Top Right Texts */}
                  <div className="absolute top-[8%] right-[6%] text-right z-30">
                    <h4 className="font-bold text-[8px] sm:text-[10px] tracking-[0.2em] text-[#2B2C30] mb-0">MORE</h4>
                    <h2 className="font-bold text-[28px] sm:text-[34px] xl:text-[40px] text-[#D32F2F] leading-[0.9] -mr-1 tracking-tighter">Stylish</h2>
                    <h5 className="font-bold text-[9px] sm:text-[10px] xl:text-[12px] text-[#0F2439] mt-0.5 tracking-tight">Casual style</h5>
                  </div>

                  {/* "75% OFF" Texts overlaid on top of blur */}
                  <div className="absolute bottom-[20%] right-[10%] text-center z-40 transform">
                    <div className="w-8 h-[2px] bg-[#2B2C30] mb-1 mx-auto"></div>
                    <h3 className="font-black text-xl sm:text-2xl xl:text-3xl text-[#0F2439] tracking-tighter leading-none mb-0.5">75% OFF</h3>
                    <p className="font-medium text-[8px] sm:text-[9px] xl:text-[10px] tracking-widest text-[#2B2C30]">FASHION SALE</p>
                  </div>
                  
                  {/* WWW.STORE.COM */}
                  <div className="absolute bottom-[6%] right-[24%] z-40">
                    <span className="text-[5px] sm:text-[6px] xl:text-[7px] font-bold tracking-[0.1em] text-[#2B2C30]">WWW.STORE.COM</span>
                  </div>
                </div>
              </motion.div>

              {recentPosts.slice(2).map((post, i) => (
                <motion.article
                  key={`${post.id}-${i + 2}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i + 2) * 0.1 }}
                  className="group"
                >
                  <a href={`/blog/${post.slug}`} className="block mb-8 overflow-hidden rounded-2xl aspect-[4/5] relative">
                    <ImageWithFallback
                      src={post.featured_image || ''}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  </a>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                        {post.categories?.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-brand-accent transition-colors">
                      <a href={`/blog/${post.slug}`}>{post.title}</a>
                    </h3>
                    <p className="text-sm text-black/50 line-clamp-2 font-medium leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 flex items-center justify-between border-t border-black/5">
                      <div className="flex items-center">
                        <ImageWithFallback src={post.profiles?.avatar_url || ''} alt="" className="w-6 h-6 rounded-full mr-3 grayscale" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/60">{post.profiles?.username}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </>
          )}
        </div>
      </section>

      {/* NEW: Category Grid Showcase */}
      <CategoryShowcase />

      {/* Top Brands Slider with Offers */}
      <BrandsSlider />

      {/* NEW: Advanced Scrolling Product Cards Section */}
      <section className="bg-brand-gray py-40 overflow-hidden relative">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-brand-gray to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-gray to-transparent z-10 pointer-events-none" />

        <div className="text-center mb-24 relative z-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">Parallax Selection</span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter">Motion & Form.</h2>
        </div>

        {/* Horizontal Scrolling Track */}
        <div className="relative h-[600px] w-full flex items-center justify-center">
          <div className="flex gap-x-8 md:gap-x-[-100px] items-center px-[20vw] absolute hover:[&>div]:opacity-30">
            {MOCK_PRODUCTS.slice(3, 8).map((product, i) => (
              <motion.a
                key={`scroll-${product.id}`}
                href={`/product/${product.slug}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, zIndex: 40, opacity: "1 !important" } as any}
                transition={{ duration: 0.4 }}
                viewport={{ margin: "1000px 0px 1000px 0px" }} // Triggers earlier
                className={cn(
                  "relative flex-none w-[280px] md:w-[350px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer bg-white group block",
                  // Stagger vertical translation to create overlapping wave effect
                  i % 2 === 0 ? "md:-translate-y-12" : "md:translate-y-12",
                  "-ml-12 md:-ml-24 first:ml-0" // Overlapping negative margin
                )}
                style={{ zIndex: i }}
              >
                <ImageWithFallback
                  src={product.image_url}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/10 transition-colors" />

                <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent transition-opacity duration-300">
                  <span className="self-end px-3 py-1 bg-white/90 text-[9px] font-bold uppercase tracking-widest text-brand-black rounded-sm backdrop-blur-md">
                    {product.formatted_price}
                  </span>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-2 block">{product.category}</span>
                    <h3 className="font-serif text-xl font-bold text-white leading-tight">{product.title}</h3>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="bg-[#1c1917] py-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-8 block">Join the Avant-Garde</span>
            <h2 className="text-5xl md:text-8xl font-serif font-bold text-white mb-12 leading-[0.85] tracking-tighter">
              The Weekly <br /> <span className="italic text-brand-accent">Manifesto</span>
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
              Curated insights into the future of luxury, delivered with editorial precision.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-1 bg-white/5 border border-white/10 rounded-full py-5 px-8 text-white text-xs font-bold tracking-widest focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button className="px-10 py-5 bg-white text-brand-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-accent hover:text-white transition-all">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
