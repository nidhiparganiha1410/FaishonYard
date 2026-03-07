import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post, Category as CategoryType } from '../types';
import { formatDate } from '../lib/utils';
import { ArrowRight } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

export default function Category({ slug }: { slug?: string }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [category, setCategory] = useState<CategoryType | null>(null);
    const [loading, setLoading] = useState(true);

    // Fallback for getting slug from URL if not passed as prop
    const currentSlug = slug || window.location.pathname.split('/').pop();

    useEffect(() => {
        if (currentSlug) {
            fetchCategoryAndPosts();
        }
    }, [currentSlug]);

    async function fetchCategoryAndPosts() {
        setLoading(true);
        try {
            // Get category ID
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', currentSlug)
                .single();

            if (catError) throw catError;
            if (catData) {
                setCategory(catData);
                // Get posts for category
                const { data: postsData } = await supabase
                    .from('posts')
                    .select('*, categories(*), profiles(*)')
                    .eq('category_id', catData.id)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (postsData) {
                    setPosts(postsData as Post[]);
                }
            }
        } catch (error) {
            console.error('Error fetching category:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-serif text-2xl animate-pulse text-brand-black">Loading...</div>;
    }

    if (!category) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Category Not Found</h1>
                <p className="text-black/50 mb-8 max-w-md">The editorial section you are looking for does not exist or has been removed.</p>
                <a href="/" className="px-8 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all flex items-center">
                    Return Home <ArrowRight className="ml-2 w-4 h-4" />
                </a>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-brand-white pt-24 pb-32">
            {/* Header */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6 block">Editorial Category</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-6">{category.name}</h1>
                    <p className="text-lg text-black/50 font-light leading-relaxed">
                        {category.description || `Explore our latest articles and editorials in ${category.name}.`}
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="max-w-[1600px] mx-auto px-6 md:px-12">
                {posts.length === 0 ? (
                    <div className="text-center py-20 border border-black/5 bg-white rounded-2xl">
                        <h3 className="text-2xl font-serif font-bold mb-2">No Articles Yet</h3>
                        <p className="text-black/40 text-sm">Check back soon for new content in {category.name}.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {posts.map((post) => (
                            <article key={post.id} className="group flex flex-col h-full">
                                <a href={`/blog/${post.slug}`} className="block mb-6 overflow-hidden rounded-2xl aspect-[4/5] relative">
                                    <ImageWithFallback
                                        src={post.featured_image || ''}
                                        alt={post.title}
                                        fallbackSrc="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
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
                                    <p className="text-xs text-black/50 line-clamp-3 leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4 flex items-center justify-between border-t border-black/5 mt-auto">
                                        <div className="flex items-center">
                                            <ImageWithFallback
                                                src={post.profiles?.avatar_url || ''}
                                                fallbackSrc="https://via.placeholder.com/150"
                                                alt=""
                                                className="w-6 h-6 rounded-full mr-3 grayscale"
                                            />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-black/60">{post.profiles?.username || 'Author'}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
