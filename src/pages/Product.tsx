import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Star, Share2, Heart, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import ImageWithFallback from '../components/ImageWithFallback';
import { Product as ProductType } from '../types';

interface ProductPageProps {
    slug: string;
}

export default function Product({ slug }: ProductPageProps) {
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('M');

    const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

    useEffect(() => {
        // Simulate network delay
        setTimeout(() => {
            const foundProduct = MOCK_PRODUCTS.find(p => p.slug === slug);
            setProduct(foundProduct || null);
            setLoading(false);
        }, 500);
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen pt-32 pb-24 flex items-center justify-center">
                <div className="font-serif text-2xl animate-pulse text-brand-black">Loading Object...</div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-serif font-bold mb-4">Object Not Found</h1>
                <p className="text-black/50 mb-8">The archive you are looking for does not exist.</p>
                <a href="/shop" className="px-8 py-3 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-full">
                    Return to Archive
                </a>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-brand-white pt-24 pb-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">

                {/* Navigation Breadcrumb */}
                <div className="mb-8">
                    <a href="/shop" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-black/50 hover:text-brand-accent transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Archive
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Image Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="aspect-[3/4] rounded-2xl overflow-hidden bg-brand-gray relative group"
                        >
                            <ImageWithFallback
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {product.is_new && (
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-brand-black text-[10px] font-bold uppercase tracking-[0.2em] rounded border border-black/5">
                                        New Arrival
                                    </span>
                                )}
                                {product.is_popular && (
                                    <span className="px-4 py-2 bg-brand-accent/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                                        Trending
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-8"
                        >
                            {/* Header */}
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent block">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center space-x-1 text-black/60">
                                        <Star className="w-4 h-4 fill-black/60" />
                                        <span className="text-xs font-bold">{product.rating}</span>
                                        <span className="text-[10px] ml-1">({product.reviews_count})</span>
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4">
                                    {product.title}
                                </h1>

                                <div className="text-2xl font-medium tracking-tight bg-brand-gray inline-block px-4 py-2 rounded-lg">
                                    {product.formatted_price}
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-black/60 text-sm leading-relaxed border-y border-black/5 py-8">
                                {product.description}
                                <br /><br />
                                Designed with meticulous attention to detail, this piece challenges conventional forms while maintaining its foundational purpose. Fabricated using premium materials sourced globally.
                            </p>

                            {/* Size Selector */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest">Select Size</span>
                                    <button className="text-[10px] uppercase font-bold text-black/40 hover:text-black hover:underline transition-colors">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                    {SIZES.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 rounded-lg text-xs font-bold transition-all ${selectedSize === size
                                                    ? 'bg-brand-black text-white border border-brand-black'
                                                    : 'bg-white text-black/60 border border-black/10 hover:border-black/30'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => alert('Added to cart!')}
                                    className="flex-1 bg-brand-black text-white py-4 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-accent transition-colors flex items-center justify-center group"
                                >
                                    <ShoppingBag className="w-4 h-4 mr-3 group-hover:-translate-y-1 transition-transform" /> Add to Cart
                                </button>
                                <button className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-brand-gray transition-colors hover:border-black/30">
                                    <Heart className="w-5 h-5 text-black/60" />
                                </button>
                                <button className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-brand-gray transition-colors hover:border-black/30">
                                    <Share2 className="w-5 h-5 text-black/60" />
                                </button>
                            </div>

                            {/* Value Props */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-black/5">
                                <div className="flex flex-col items-center text-center">
                                    <Truck className="w-6 h-6 mb-3 text-black/40" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Free Global Shipping</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <RefreshCw className="w-6 h-6 mb-3 text-black/40" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">30-Day Returns</span>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <ShieldCheck className="w-6 h-6 mb-3 text-black/40" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Authenticity Guarantee</span>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </main>
    );
}
