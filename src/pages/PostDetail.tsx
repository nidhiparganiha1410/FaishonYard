import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types';
import { formatDate } from '../lib/utils';
import { Clock, Eye, Share2, Bookmark, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

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

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="h-screen flex items-center justify-center">Post not found</div>;

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
                <span className="flex items-center"><Eye className="w-4 h-4 mr-2" /> {post.view_count} views</span>
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
                  <li className="hover:text-black cursor-pointer transition-colors">Key Pieces for 2024</li>
                  <li className="hover:text-black cursor-pointer transition-colors">Conclusion</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <div className="prose prose-lg max-w-none font-serif leading-relaxed text-black/80">
              {/* TipTap content would be rendered here. For now, a placeholder. */}
              <p className="text-2xl font-light italic mb-12 leading-relaxed text-black/60">
                "{post.excerpt}"
              </p>
              
              <div className="space-y-8">
                {/* Simulated Content */}
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <div className="my-12 p-8 bg-brand-gray border border-black/5 rounded-3xl flex items-center space-x-8">
                  <div className="w-32 h-32 flex-shrink-0 bg-white rounded-2xl overflow-hidden">
                    <img src="https://picsum.photos/seed/fashion1/400/400" alt="Product" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Editor's Choice</span>
                    <h4 className="text-xl font-serif font-bold mb-2">The Essential Silk Blazer</h4>
                    <p className="text-sm text-black/60 mb-4">A timeless piece that defines the luxury minimalist wardrobe.</p>
                    <a href="/go/silk-blazer" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1">Shop Now</a>
                  </div>
                </div>

                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
                  <h4 className="text-xl font-serif font-bold mb-4">Summer Collection 2024</h4>
                  <p className="text-sm text-black/40 mb-8">Discover the new arrivals in our curated boutique.</p>
                  <button className="px-6 py-3 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
