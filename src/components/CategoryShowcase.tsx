import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Post } from '../types';
import { supabase } from '../lib/supabase';
import { formatDate, cn } from '../lib/utils';
import { PostSkeleton } from './Skeletons';

// Unique, verified Unsplash images for each mock post
const MOCK_CATEGORY_POSTS: Partial<Post>[][] = [
    // Category 1 - Innovation
    [
        { id: 'cat1-1', title: 'The Algorithm of Elegance', excerpt: 'How AI shapes the new runway.', slug: 'algo-elegance', featured_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
        { id: 'cat1-2', title: 'Data-Driven Design', excerpt: 'Predicting the next silhouette.', slug: 'data-design', featured_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
        { id: 'cat1-3', title: 'Virtual Threads', excerpt: 'Dressing the metaverse.', slug: 'virtual-threads', featured_image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() }
    ],
    // Category 2 - Minimalism
    [
        { id: 'cat2-1', title: 'The Evolution of Simplicity', excerpt: 'Redefining luxury through restraint.', slug: 'algo-elegance', featured_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
        { id: 'cat2-2', title: 'Smart Outdoor Runway', excerpt: 'Where nature meets haute couture.', slug: 'data-design', featured_image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
        { id: 'cat2-3', title: 'Monochrome Mastery', excerpt: 'The enduring power of black and white.', slug: 'virtual-threads', featured_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() }
    ],
    // Category 3 - Culture
    [
        { id: 'cat3-1', title: 'Fashion Capitals Reimagined', excerpt: 'How global cities shape style.', slug: 'algo-elegance', featured_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
        { id: 'cat3-2', title: 'Heritage & Innovation', excerpt: 'Blending tradition with tomorrow.', slug: 'data-design', featured_image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() },
        { id: 'cat3-3', title: 'Street to Runway', excerpt: 'How urban culture fuels high fashion.', slug: 'virtual-threads', featured_image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=800&q=80', created_at: new Date().toISOString() }
    ]
];

// Gradient placeholder for broken images
const IMG_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F8F8F7"/><stop offset="100%" stop-color="#E8E8E5"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><text x="400" y="500" text-anchor="middle" font-family="serif" font-size="48" fill="#C5A059" opacity="0.4">FY</text></svg>');

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => { (e.target as HTMLImageElement).src = IMG_PLACEHOLDER; }}
            loading="lazy"
        />
    );
}

export default function CategoryShowcase() {
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryPosts, setCategoryPosts] = useState<Record<string, Post[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategoryData() {
            const { data: cats } = await supabase.from('categories').select('*').limit(3);
            const activeCats = cats?.length ? cats : [
                { id: 1, name: 'Innovation', slug: 'innovation' },
                { id: 2, name: 'Minimalism', slug: 'minimalism' },
                { id: 3, name: 'Culture', slug: 'culture' }
            ];
            setCategories(activeCats);

            const postsData: Record<string, Post[]> = {};

            for (let ci = 0; ci < activeCats.length; ci++) {
                const cat = activeCats[ci];
                const { data: posts } = await supabase
                    .from('posts')
                    .select('*, profiles(*)')
                    .eq('status', 'published')
                    .eq('category_id', cat.id)
                    .order('created_at', { ascending: false })
                    .limit(3);

                // Use unique mock data per category if Supabase is empty
                postsData[cat.slug] = posts?.length === 3 ? posts as Post[] : MOCK_CATEGORY_POSTS[ci] as Post[];
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

    // 1. Masonry Style (for 1st category)
    const renderMasonry = (posts: Post[], index: number) => (
        <div key={index} className="mb-20">
            <div className="mb-12 flex justify-between items-end">
                <h2 className="text-4xl md:text-6xl font-serif font-bold">{categories[index].name}</h2>
                <a href={`/category/${categories[index].slug}`} className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-brand-accent">
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 aspect-[4/5] md:aspect-auto md:h-[600px] relative group cursor-pointer overflow-hidden rounded-xl">
                    <SafeImage src={posts[0].featured_image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                        <h3 className="text-3xl font-serif font-bold text-white mb-2">{posts[0].title}</h3>
                        <p className="text-white/60 text-sm line-clamp-2">{posts[0].excerpt}</p>
                    </div>
                </div>
                <div className="md:col-span-5 flex flex-col gap-8 h-full">
                    <div className="flex-1 aspect-video relative group cursor-pointer overflow-hidden rounded-xl">
                        <SafeImage src={posts[1].featured_image} alt={posts[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <h3 className="text-xl font-serif font-bold text-white">{posts[1].title}</h3>
                        </div>
                    </div>
                    <div className="flex-1 aspect-video relative group cursor-pointer overflow-hidden rounded-xl">
                        <SafeImage src={posts[2].featured_image} alt={posts[2].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <h3 className="text-xl font-serif font-bold text-white">{posts[2].title}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 2. Asymmetrical Columns (for 2nd category) — ALL 3 cards with visible images
    const renderAsymmetrical = (posts: Post[], index: number) => (
        <div key={index} className="mb-20">
            <div className="mb-12 flex justify-between items-end text-right flex-row-reverse">
                <h2 className="text-4xl md:text-6xl font-serif font-bold">{categories[index].name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {posts.map((post, i) => (
                    <a href={`/blog/${post.slug}`} key={post.id} className={cn("group cursor-pointer block", i === 1 ? "md:-translate-y-8" : "md:translate-y-4")}>
                        <div className="aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-brand-gray">
                            <SafeImage src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/40 block mb-2">{formatDate(post.created_at)}</span>
                        <h3 className="text-2xl font-serif font-bold group-hover:text-brand-accent transition-colors">{post.title}</h3>
                        <p className="text-sm text-black/50 mt-2 line-clamp-2">{post.excerpt}</p>
                    </a>
                ))}
            </div>
        </div>
    );

    // 3. Full-width cards (for 3rd category) — NO blank space
    const renderFeatured = (posts: Post[], index: number) => (
        <div key={index}>
            <div className="mb-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent block mb-2">Category</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold">{categories[index].name}</h2>
            </div>
            <div className="flex flex-col gap-8">
                {/* Top Hero */}
                <a href={`/blog/${posts[0].slug}`} className="w-full h-[50vh] relative overflow-hidden group rounded-2xl cursor-pointer block">
                    <SafeImage src={posts[0].featured_image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center text-center p-6">
                        <div>
                            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{posts[0].title}</h3>
                            <p className="text-white/80 max-w-lg mx-auto">{posts[0].excerpt}</p>
                        </div>
                    </div>
                </a>
                {/* Bottom Row — FULL WIDTH cards with images instead of tiny thumbnails */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[posts[1], posts[2]].map(post => (
                        <a href={`/blog/${post.slug}`} key={post.id} className="relative aspect-[16/9] overflow-hidden rounded-xl group cursor-pointer block">
                            <SafeImage src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h4 className="font-serif font-bold text-2xl text-white group-hover:text-brand-accent transition-colors mb-2">{post.title}</h4>
                                <p className="text-sm text-white/60 line-clamp-2">{post.excerpt}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 border-t border-black/5">
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
