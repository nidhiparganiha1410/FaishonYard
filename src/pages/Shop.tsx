import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, ArrowRight, Minus, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { PostSkeleton } from '../components/Skeletons';
import ImageWithFallback from '../components/ImageWithFallback';

type SortOption = 'latest' | 'popular' | 'price-asc' | 'price-desc';

export default function Shop() {
    const [products, setProducts] = useState<(Product & { categories: Category })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
            supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
            supabase.from('categories').select('*').order('name')
        ]);

        if (productsRes.data) setProducts(productsRes.data as any);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        setLoading(false);
    }

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.categories?.name === selectedCategory);
        }

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        }

        // Sort
        result.sort((a, b) => {
            const priceA = a.offer_price || a.price;
            const priceB = b.offer_price || b.price;
            switch (sortBy) {
                case 'price-asc': return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                case 'popular': return b.reviews_count - a.reviews_count;
                case 'latest':
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return result;
    }, [products, selectedCategory, searchQuery, sortBy]);

    return (
        <main className="min-h-screen bg-brand-white pt-24 pb-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Header Section */}
                <div className="mb-16 border-b border-black/5 pb-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6 block">Avant-Garde Selection</span>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[0.9] tracking-tighter">
                            The Archive
                        </h1>
                        <p className="text-black/40 text-sm max-w-sm font-medium leading-relaxed">
                            Curated objects of desire. An exploration of structural minimalism and timeless mechanics.
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-12">

                    {/* Categories (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-2 bg-brand-gray p-1 rounded-full border border-black/5">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                selectedCategory === 'All' ? "bg-brand-black text-white" : "text-black/50 hover:text-black hover:bg-black/5"
                            )}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                    selectedCategory === cat.name ? "bg-brand-black text-white" : "text-black/50 hover:text-black hover:bg-black/5"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center w-full lg:w-auto gap-4">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-brand-gray border border-black/5 rounded-full text-xs font-bold tracking-widest focus:outline-none focus:border-brand-accent transition-colors"
                            />
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="lg:hidden p-3 bg-brand-gray border border-black/5 rounded-full"
                        >
                            <Filter className="w-5 h-5" />
                        </button>

                        <div className="relative hidden md:block group z-30">
                            <button className="flex items-center px-6 py-3 bg-brand-gray border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-black/20 transition-all">
                                <SlidersHorizontal className="w-3 h-3 mr-2" />
                                Sort: {sortBy.replace('-', ' ')}
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {(['latest', 'popular', 'price-asc', 'price-desc'] as SortOption[]).map(option => (
                                    <button
                                        key={option}
                                        onClick={() => setSortBy(option)}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-brand-gray",
                                            sortBy === option && "text-brand-accent"
                                        )}
                                    >
                                        {option.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Filters */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden mb-10 overflow-hidden"
                        >
                            <div className="p-6 bg-brand-gray border border-black/5 rounded-2xl space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedCategory('All')}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                                selectedCategory === 'All' ? "bg-brand-black text-white" : "bg-white border border-black/5 text-black/60"
                                            )}
                                        >
                                            All
                                        </button>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.name)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                                    selectedCategory === cat.name ? "bg-brand-black text-white" : "bg-white border border-black/5 text-black/60"
                                                )}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => <PostSkeleton key={i} />)}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-32 text-center">
                        <ShoppingBag className="w-12 h-12 text-black/10 mx-auto mb-6" />
                        <h3 className="text-2xl font-serif font-bold mb-4">The archive is empty</h3>
                        <p className="text-black/50 text-sm font-medium">Try adjusting your filters or check back later.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-8 px-8 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 gap-y-16">
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.article
                                    layout
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="group cursor-pointer block"
                                    onClick={() => window.location.href = `/product/${product.slug}`}
                                >
                                    <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-brand-gray rounded-xl">
                                        <ImageWithFallback
                                            src={product.featured_image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {product.is_new && (
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-black text-[9px] font-bold uppercase tracking-widest rounded-sm border border-black/5">
                                                    New Arrival
                                                </span>
                                            )}
                                            {product.is_popular && (
                                                <span className="px-3 py-1 bg-brand-accent/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-sm">
                                                    Trending
                                                </span>
                                            )}
                                        </div>

                                        {/* Quick Add Button */}
                                        <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                            <button className="w-full py-4 bg-brand-black/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-brand-accent transition-colors flex items-center justify-center">
                                                View Object <ArrowRight className="ml-2 w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 px-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                                                {product.categories?.name}
                                            </span>
                                            <div className="flex flex-col items-end">
                                                {product.offer_price ? (
                                                  <>
                                                    <span className="text-sm font-bold text-red-500">
                                                        {formatCurrency(product.offer_price)}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-black/30 line-through">
                                                        {formatCurrency(product.price)}
                                                    </span>
                                                  </>
                                                ) : (
                                                  <span className="text-sm font-medium tracking-tight bg-brand-gray px-3 py-1 rounded-full">
                                                      {formatCurrency(product.price)}
                                                  </span>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-serif font-bold group-hover:text-brand-accent transition-colors leading-tight">
                                            {product.title}
                                        </h3>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
