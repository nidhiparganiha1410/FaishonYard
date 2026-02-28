import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, TrendingUp, Clock, Eye, Sparkles, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Post, Product } from '../types';
import { formatDate, cn } from '../lib/utils';
import { HeroSkeleton, PostSkeleton } from '../components/Skeletons';
import CategoryShowcase from '../components/CategoryShowcase';

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
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        {loading ? (
          <HeroSkeleton />
        ) : (
          <div className="flex h-full flex-col lg:flex-row">
            {/* Left: Featured Slider */}
            <div className="w-full lg:w-[68%] relative h-full group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredPosts[currentSlide]?.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={featuredPosts[currentSlide]?.featured_image}
                    alt={featuredPosts[currentSlide]?.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="max-w-3xl"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <span className="px-3 py-1 bg-brand-accent text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
                          {featuredPosts[currentSlide]?.categories?.name}
                        </span>
                        <span className="flex items-center text-white/60 text-[10px] font-bold uppercase tracking-widest">
                          <Sparkles className="w-3 h-3 mr-1" /> Featured Editorial
                        </span>
                      </div>

                      <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-[0.9] mb-8 text-balance">
                        {featuredPosts[currentSlide]?.title}
                      </h1>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {featuredPosts[currentSlide]?.bullet_points?.slice(0, 3).map((point, i) => (
                          <div key={i} className="flex items-start space-x-3 text-white/70">
                            <div className="w-1 h-1 bg-brand-accent rounded-full mt-2 flex-shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>

                      <a
                        href={`/blog/${featuredPosts[currentSlide]?.slug}`}
                        className="inline-flex items-center px-10 py-5 bg-white text-brand-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-accent hover:text-white transition-all duration-500 rounded-full group/btn"
                      >
                        Explore Article
                        <ArrowRight className="ml-3 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                      </a>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Progress */}
              <div className="absolute bottom-12 right-12 flex space-x-3 z-20">
                {featuredPosts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={cn(
                      "h-1 transition-all duration-500 rounded-full",
                      currentSlide === i ? "w-16 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Right: Trending Now */}
            <div className="hidden lg:flex lg:w-[32%] bg-brand-gray flex-col border-l border-black/5">
              <div className="p-10 border-b border-black/5">
                <h2 className="text-2xl font-serif font-bold flex items-center tracking-tight">
                  <TrendingUp className="mr-3 w-6 h-6 text-brand-accent" /> Trending Now
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {trendingPosts.map((post, index) => (
                  <a
                    key={`${post.id}-${index}`}
                    href={`/blog/${post.slug}`}
                    className="flex items-start p-10 hover:bg-white transition-all duration-500 group border-b border-black/5 last:border-0"
                  >
                    <span className="text-5xl font-serif font-bold text-black/5 mr-8 group-hover:text-brand-accent/20 transition-colors">
                      {index + 1}
                    </span>
                    <div className="space-y-3">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                        {post.categories?.name}
                      </span>
                      <h3 className="font-serif font-bold text-xl leading-tight group-hover:text-brand-accent transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-[9px] font-bold uppercase tracking-widest text-black/30">
                        <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {post.view_count?.toLocaleString()}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.read_time} MIN</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* NEW: Premium Horizontal Product Slider Section */}
      <section className="bg-brand-black text-white py-32 overflow-hidden border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">The Collection</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter">Featured Objects.</h2>
          </div>
          <a href="/shop" className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-widest hover:text-brand-accent transition-colors group">
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
              className="flex-none w-[300px] md:w-[400px] snap-center group cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-xl mb-6 relative bg-white/5">
                <img
                  src={product.image_url}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-sm font-bold tracking-widest">{product.formatted_price}</span>
                  <button className="w-10 h-10 rounded-full bg-white text-brand-black flex items-center justify-center hover:bg-brand-accent hover:text-white transition-colors">
                    <Navigation className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 block mb-2">{product.category}</span>
                <h3 className="font-serif text-2xl font-bold group-hover:text-brand-accent transition-colors">{product.title}</h3>
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
            recentPosts.map((post, i) => (
              <motion.article
                key={`${post.id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <a href={`/blog/${post.slug}`} className="block mb-8 overflow-hidden rounded-2xl aspect-[4/5] relative">
                  <img
                    src={post.featured_image}
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
                      <img src={post.profiles?.avatar_url} alt="" className="w-6 h-6 rounded-full mr-3 grayscale" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/60">{post.profiles?.username}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </section>

      {/* NEW: Category Grid Showcase */}
      <CategoryShowcase />

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
              <motion.div
                key={`scroll-${product.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, zIndex: 40, opacity: "1 !important" } as any}
                transition={{ duration: 0.4 }}
                viewport={{ margin: "1000px 0px 1000px 0px" }} // Triggers earlier
                className={cn(
                  "relative flex-none w-[280px] md:w-[350px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer bg-white group",
                  // Stagger vertical translation to create overlapping wave effect
                  i % 2 === 0 ? "md:-translate-y-12" : "md:translate-y-12",
                  "-ml-12 md:-ml-24 first:ml-0" // Overlapping negative margin
                )}
                style={{ zIndex: i }}
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  loading="lazy"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="bg-brand-black py-32 overflow-hidden relative">
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
