import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types';
import { formatDate } from '../lib/utils';
import { Clock, Eye, Share2, Bookmark, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const DEMO_POSTS_MAP: Record<string, Partial<Post>> = {
  'future-digital-couture': {
    id: 'demo-1',
    title: 'The Future of Digital Couture: 2026 and Beyond',
    slug: 'future-digital-couture',
    excerpt: 'Exploring how generative AI and augmented reality are redefining the luxury atelier experience.',
    featured_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    categories: { name: 'Innovation' } as any,
    view_count: 15400,
    read_time: 12,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    profiles: { username: 'Elena Vance', avatar_url: 'https://i.pravatar.cc/150?u=elena' } as any
  },
  'quiet-luxury-texture': {
    id: 'demo-2',
    title: 'Quiet Luxury: The Texture of Silence',
    slug: 'quiet-luxury-texture',
    excerpt: 'Why the most powerful statements in fashion are the ones whispered through exquisite craftsmanship.',
    featured_image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
    categories: { name: 'Minimalism' } as any,
    view_count: 8200,
    read_time: 8,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    profiles: { username: 'Julian Thorne', avatar_url: 'https://i.pravatar.cc/150?u=julian' } as any
  },
  'algo-elegance': {
    id: 'demo-3',
    title: 'The Algorithm of Elegance',
    slug: 'algo-elegance',
    excerpt: 'How artificial intelligence is shaping the new runway and redefining what it means to be stylish.',
    featured_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    categories: { name: 'Innovation' } as any,
    view_count: 5600,
    read_time: 10,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    profiles: { username: 'Aria Chen', avatar_url: 'https://i.pravatar.cc/150?u=aria' } as any
  },
  'data-design': {
    id: 'demo-4',
    title: 'Data-Driven Design',
    slug: 'data-design',
    excerpt: 'Predicting the next silhouette through machine learning and trend analysis.',
    featured_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    categories: { name: 'Innovation' } as any,
    view_count: 3200,
    read_time: 7,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    profiles: { username: 'Marcus Lee', avatar_url: 'https://i.pravatar.cc/150?u=marcus' } as any
  },
  'virtual-threads': {
    id: 'demo-5',
    title: 'Virtual Threads',
    slug: 'virtual-threads',
    excerpt: 'Dressing the metaverse — how digital fashion is creating new economies and identities.',
    featured_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    categories: { name: 'Culture' } as any,
    view_count: 4800,
    read_time: 9,
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    profiles: { username: 'Sofia Noir', avatar_url: 'https://i.pravatar.cc/150?u=sofia' } as any
  }
};

export default function PostDetail({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(*), profiles(*)')
      .eq('slug', slug)
      .single();

    if (data) {
      setPost(data);
      incrementViewCount(data.id);
      fetchComments(data.id);
    } else {
      // Fallback to demo post
      const demoPost = DEMO_POSTS_MAP[slug];
      if (demoPost) {
        setPost(demoPost as Post);
      }
    }
    setLoading(false);
  }

  async function incrementViewCount(postId: string) {
    await fetch(`/api/posts/${postId}/view`, { method: 'POST' });
  }

  async function fetchComments(postId: string) {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    if (data) setComments(data);
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-2xl animate-pulse text-brand-black">Loading...</div>;
  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-serif font-bold mb-6">404</h1>
      <p className="text-xl text-black/50 mb-8 font-medium">The article you're looking for doesn't exist.</p>
      <a href="/" className="px-8 py-4 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-colors">
        Back to Home
      </a>
    </div>
  );

  return (
    <article className="pb-24">
      {/* Article Hero */}
      <header className="relative h-[70vh] w-full mb-16">
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em]">
                {post.categories?.name}
              </span>
              <h1 className="text-4xl md:text-7xl font-serif font-bold text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {post.read_time} min read</span>
                <span className="flex items-center"><Eye className="w-4 h-4 mr-2" /> {post.view_count?.toLocaleString()} views</span>
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar / Author */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-brand-gray overflow-hidden">
                  <img src={post.profiles?.avatar_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">Written by</span>
                  <span className="text-sm font-bold uppercase tracking-widest">{post.profiles?.username}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40">Share this story</h4>
                <div className="flex space-x-4">
                  <button className="p-3 border border-black/5 rounded-full hover:bg-brand-gray transition-colors"><Share2 className="w-4 h-4" /></button>
                  <button className="p-3 border border-black/5 rounded-full hover:bg-brand-gray transition-colors"><Bookmark className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="p-6 bg-brand-gray rounded-2xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4">Table of Contents</h4>
                <ul className="space-y-3 text-sm text-black/60 font-medium">
                  <li className="hover:text-black cursor-pointer transition-colors">Introduction</li>
                  <li className="hover:text-black cursor-pointer transition-colors">The Minimalist Philosophy</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Key Pieces for 2026</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Conclusion</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <div className="prose prose-lg max-w-none font-serif leading-relaxed text-black/80">
              <p className="text-2xl font-light italic mb-12 leading-relaxed text-black/60">
                "{post.excerpt}"
              </p>

              <div className="space-y-8">
                <p>In an era where technology and tradition merge seamlessly, the luxury fashion landscape is undergoing a profound transformation. Designers are no longer confined to physical ateliers — instead, they leverage cutting-edge tools to push the boundaries of creativity and craftsmanship.</p>

                <h2 className="text-3xl font-serif font-bold mt-16 mb-6">The Evolution of Modern Aesthetics</h2>
                <p>The intersection of artificial intelligence and haute couture has birthed an entirely new design paradigm. From predictive trend analysis to generative pattern creation, technology serves as both muse and medium for the contemporary designer.</p>

                <div className="my-12 p-8 bg-brand-gray border border-black/5 rounded-3xl flex items-center space-x-8">
                  <div className="w-32 h-32 flex-shrink-0 bg-white rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=400&q=80" alt="Product" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Editor's Choice</span>
                    <h4 className="text-xl font-serif font-bold mb-2">The Essential Silk Blazer</h4>
                    <p className="text-sm text-black/60 mb-4">A timeless piece that defines the luxury minimalist wardrobe.</p>
                    <a href="/shop" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1">Shop Now</a>
                  </div>
                </div>

                <h2 className="text-3xl font-serif font-bold mt-16 mb-6">Sustainability Meets Innovation</h2>
                <p>Beyond aesthetics, the fashion industry is embracing sustainable practices powered by data-driven insights. Virtual prototyping reduces waste, while blockchain technology ensures supply chain transparency — creating a future where luxury and responsibility coexist harmoniously.</p>

                <blockquote className="border-l-4 border-brand-accent pl-8 py-4 my-12 text-xl italic text-black/60">
                  "The most enduring luxury is not what we wear, but how thoughtfully it was created."
                </blockquote>

                <p>As we look ahead, the convergence of digital innovation and artisanal craftsmanship promises to redefine not just what we wear, but how we think about fashion itself. The future belongs to those who can bridge the gap between heritage and horizon.</p>
              </div>
            </div>

            {/* Comments Section */}
            <section className="mt-24 pt-16 border-t border-black/5">
              <h3 className="text-2xl font-serif font-bold mb-12 flex items-center">
                <MessageSquare className="mr-3 w-6 h-6" /> Comments ({comments.length})
              </h3>

              <div className="space-y-12">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-6">
                    <div className="w-10 h-10 rounded-full bg-brand-gray overflow-hidden flex-shrink-0">
                      <img src={comment.profiles?.avatar_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest">{comment.profiles?.username}</span>
                        <span className="text-[10px] text-black/40 uppercase tracking-widest">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-black/70 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-12 p-8 bg-brand-gray rounded-3xl">
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Leave a comment</h4>
                  <textarea
                    placeholder="Share your thoughts..."
                    className="w-full bg-white border border-black/5 rounded-2xl p-6 text-sm focus:outline-none focus:border-black/20 transition-colors min-h-[150px]"
                  />
                  <button className="mt-6 px-8 py-4 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>
            </section>
          </main>

          {/* Sidebar / Ad Slot */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-12">
              <div className="aspect-[3/4] bg-brand-gray rounded-3xl flex items-center justify-center p-8 text-center border border-black/5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/20 mb-4 block">Advertisement</span>
                  <h4 className="text-xl font-serif font-bold mb-4">Summer Collection 2026</h4>
                  <p className="text-sm text-black/40 mb-8">Discover the new arrivals in our curated boutique.</p>
                  <a href="/shop" className="px-6 py-3 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all inline-block">
                    Explore Now
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
