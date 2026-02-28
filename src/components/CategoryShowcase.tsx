import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Post } from '../types';
import { supabase } from '../lib/supabase';
import { formatDate, cn } from '../lib/utils';
import { PostSkeleton } from './Skeletons';

// Mock posts in case Supabase is empty
const MOCK_CATEGORY_POSTS: Partial<Post>[] = [
    { id: '1', title: 'The Algorithm of Elegance', excerpt: 'How AI shapes the new runway.', slug: 'algo-elegance', featured_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
    { id: '2', title: 'Data-Driven Design', excerpt: 'Predicting the next silhouette.', slug: 'data-design', featured_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
    { id: '3', title: 'Virtual Threads', excerpt: 'Dressing the metaverse.', slug: 'virtual-threads', featured_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() }
];

export default function CategoryShowcase() {
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryPosts, setCategoryPosts] = useState<Record<string, Post[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategoryData() {
            // 1. Fetch top 3 categories
            const { data: cats } = await supabase.from('categories').select('*').limit(3);
            const activeCats = cats?.length ? cats : [
                { id: 1, name: 'Innovation', slug: 'innovation' },
                { id: 2, name: 'Minimalism', slug: 'minimalism' },
                { id: 3, name: 'Culture', slug: 'culture' }
            ];
            setCategories(activeCats);

            // 2. Fetch exactly 3 posts for each
            const postsData: Record<string, Post[]> = {};

            for (const cat of activeCats) {
                const { data: posts } = await supabase
                    .from('posts')
                    .select('*, profiles(*)')
                    .eq('status', 'published')
                    .eq('category_id', cat.id)
                    .order('created_at', { ascending: false })
                    .limit(3);

                postsData[cat.slug] = posts?.length === 3 ? posts as Post[] : MOCK_CATEGORY_POSTS as Post[];
            }

            setCategoryPosts(postsData);
            setLoading(false);
        }

        fetchCategoryData();
    }, []);

    if (loading) {
        return (
            <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-32">
                <h2 className="text-4xl font-serif font-bold mb-12">Loading Collections...</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8"><PostSkeleton /><PostSkeleton /><PostSkeleton /></div>
            </section>
        );
    }

    // --- Layout Generators ---

    // 1. Masonry Style (for 1st category)
    const renderMasonry = (posts: Post[], index: number) => (
        <div key={index} className="mb-32">
            <div className="mb-12 flex justify-between items-end">
                <h2 className="text-4xl md:text-6xl font-serif font-bold">{categories[index].name}</h2>
                <a href={`/category/${categories[index].slug}`} className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-brand-accent">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Large Left */}
                <div className="md:col-span-7 aspect-[4/5] md:aspect-auto md:h-[600px] relative group cursor-pointer overflow-hidden rounded-xl">
                    <img src={posts[0].featured_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                        <h3 className="text-3xl font-serif font-bold text-white mb-2">{posts[0].title}</h3>
                        <p className="text-white/60 text-sm line-clamp-2">{posts[0].excerpt}</p>
                    </div>
                </div>
                {/* Right Stack */}
                <div className="md:col-span-5 flex flex-col gap-8 h-full">
                    <div className="flex-1 aspect-video relative group cursor-pointer overflow-hidden rounded-xl">
                        <img src={posts[1].featured_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <h3 className="text-xl font-serif font-bold text-white">{posts[1].title}</h3>
                        </div>
                    </div>
                    <div className="flex-1 aspect-video relative group cursor-pointer overflow-hidden rounded-xl">
                        <img src={posts[2].featured_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <h3 className="text-xl font-serif font-bold text-white">{posts[2].title}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 2. Asymmetrical Columns (for 2nd category)
    const renderAsymmetrical = (posts: Post[], index: number) => (
        <div key={index} className="mb-32">
            <div className="mb-12 flex justify-between items-end text-right flex-row-reverse">
                <h2 className="text-4xl md:text-6xl font-serif font-bold">{categories[index].name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {posts.map((post, i) => (
                    <div key={post.id} className={cn("group cursor-pointer", i === 1 ? "md:-translate-y-16" : "md:translate-y-8")}>
                        <div className="aspect-[3/4] overflow-hidden rounded-xl mb-6">
                            <img src={post.featured_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/40 block mb-2">{formatDate(post.created_at)}</span>
                        <h3 className="text-2xl font-serif font-bold group-hover:text-brand-accent transition-colors">{post.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );

    // 3. Hero + Small Row (for 3rd category)
    const renderFeatured = (posts: Post[], index: number) => (
        <div key={index} className="mb-32">
            <div className="mb-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent block mb-2">Category</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold">{categories[index].name}</h2>
            </div>
            <div className="flex flex-col gap-8">
                {/* Top Hero */}
                <div className="w-full h-[50vh] relative overflow-hidden group rounded-2xl cursor-pointer">
                    <img src={posts[0].featured_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center text-center p-6">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{posts[0].title}</h3>
                            <p className="text-white/80 max-w-lg mx-auto">{posts[0].excerpt}</p>
                        </div>
                    </div>
                </div>
                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[posts[1], posts[2]].map(post => (
                        <div key={post.id} className="flex gap-6 items-center group cursor-pointer bg-brand-gray p-4 rounded-xl">
                            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                                <img src={post.featured_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-lg group-hover:text-brand-accent transition-colors">{post.title}</h4>
                                <p className="text-xs text-black/50 line-clamp-1 mt-1">{post.excerpt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-32 border-t border-black/5">
            <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">Editorial Focus</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter">Categorical Visions.</h2>
            </div>

            {categories[0] && renderMasonry(categoryPosts[categories[0].slug], 0)}
            {categories[1] && renderAsymmetrical(categoryPosts[categories[1].slug], 1)}
            {categories[2] && renderFeatured(categoryPosts[categories[2].slug], 2)}

        </section>
    );
}
