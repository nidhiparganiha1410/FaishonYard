import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { formatDate } from '../lib/utils';
import { ArrowLeft, Bookmark } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

export default function Saved() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    async function fetchSavedPosts() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            // Get bookmarks
            const { data: bookmarksData, error } = await supabase
                .from('bookmarks')
                .select('post_id')
                .eq('user_id', user.id);

            if (error) throw error;

            if (bookmarksData && bookmarksData.length > 0) {
                const postIds = bookmarksData.map(b => b.post_id);
                const { data: postsData } = await supabase
                    .from('posts')
                    .select('*, categories(*), profiles(*)')
                    .in('id', postIds)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (postsData) {
                    setPosts(postsData as Post[]);
                }
            }
        } catch (error) {
            console.error('Error fetching saved posts:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-brand-white pt-24 pb-32">
            <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16">
                <div className="flex items-center space-x-4 mb-8">
                    <a href="/profile" className="p-2 hover:bg-brand-gray rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </a>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold flex items-center">
                        <Bookmark className="w-8 h-8 mr-4 text-brand-accent" /> My Saved Articles
                    </h1>
                </div>

                {loading ? (
                    <div className="animate-pulse flex items-center font-serif text-2xl text-black/50">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 border border-black/5 bg-white rounded-2xl flex flex-col items-center justify-center">
                        <Bookmark className="w-12 h-12 text-black/20 mb-4" />
                        <h3 className="text-2xl font-serif font-bold mb-2">No Saved Articles</h3>
                        <p className="text-black/40 text-sm">Articles you save will confidently appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {posts.map((post) => (
                            <article key={post.id} className="group flex flex-col h-full bg-white p-4 rounded-2xl border border-black/5 hover:border-brand-accent/30 transition-colors">
                                <a href={`/blog/${post.slug}`} className="block mb-6 overflow-hidden rounded-xl aspect-[4/5] relative">
                                    <ImageWithFallback
                                        src={post.featured_image || ''}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                </a>
                                <div className="space-y-4 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                                            {post.categories?.name}
                                        </span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">
                                            {formatDate(post.created_at)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold leading-tight group-hover:text-brand-accent transition-colors">
                                        <a href={`/blog/${post.slug}`}>{post.title}</a>
                                    </h3>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
