import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingBag, Star, Share2, Heart, Truck, ShieldCheck, RefreshCw, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';
import { Product as ProductType, Category } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface ProductPageProps {
    slug: string;
}

export default function Product({ slug }: ProductPageProps) {
    const [product, setProduct] = useState<(ProductType & { categories: Category }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    async function fetchProduct() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(*)')
            .eq('slug', slug)
            .single();

        if (data) {
            const p = data as any;
            setProduct(p);
            setActiveImage(p.featured_image);
            if (p.sizes && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
        }
        setLoading(false);
    }

    const allImages = useMemo(() => {
      if (!product) return [];
      return [product.featured_image, ...(product.images || [])].filter(Boolean);
    }, [product]);

    if (loading) {
        return (
            <main className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-brand-white">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="font-serif text-xl text-black/40">Fetching Archive Object...</div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-brand-white px-6">
                <h1 className="text-6xl font-serif font-bold mb-6 tracking-tighter">Object Not Found</h1>
                <p className="text-black/40 mb-10 text-center max-w-md">The requested artifact could not be located in our archives. It may have been decommissioned or moved.</p>
                <a href="/shop" className="px-10 py-4 bg-brand-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-brand-accent transition-all transform hover:scale-105">
                    Return to Archive
                </a>
            </main>
        );
    }

    const handleAffiliateClick = () => {
      if (product.affiliate_link) {
        window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
      }
    };

    return (
        <main className="min-h-screen bg-brand-white pt-24 pb-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">

                {/* Navigation Breadcrumb */}
                <div className="mb-12">
                    <a href="/shop" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 hover:text-brand-accent transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-3" /> Back to Archive
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Image Gallery */}
                    <div className="space-y-8">
                        <div className="relative group">
                          <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="aspect-[3/4] rounded-2xl overflow-hidden bg-brand-gray relative shadow-2xl shadow-black/5"
                          >
                              <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover"
                                />
                              </AnimatePresence>

                              {/* Badges */}
                              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                  {product.is_new && (
                                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-brand-black text-[9px] font-bold uppercase tracking-[0.2em] rounded border border-black/5">
                                          New Arrival
                                      </span>
                                  )}
                                  {product.is_popular && (
                                      <span className="px-4 py-2 bg-brand-accent/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded">
                                          Trending
                                      </span>
                                  )}
                              </div>

                              {/* Navigation Arrows for Mobile/Hover */}
                              {allImages.length > 1 && (
                                <>
                                  <button
                                    onClick={() => {
                                      const next = (currentImageIndex - 1 + allImages.length) % allImages.length;
                                      setCurrentImageIndex(next);
                                      setActiveImage(allImages[next]);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <ChevronLeft className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const next = (currentImageIndex + 1) % allImages.length;
                                      setCurrentImageIndex(next);
                                      setActiveImage(allImages[next]);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <ChevronRight className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                          </motion.div>

                          {/* Thumbnails */}
                          {allImages.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                              {allImages.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setActiveImage(img);
                                    setCurrentImageIndex(idx);
                                  }}
                                  className={cn(
                                    "relative w-24 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0 transition-all border-2",
                                    activeImage === img ? "border-brand-accent" : "border-transparent opacity-60 hover:opacity-100"
                                  )}
                                >
                                  <img src={img} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Specifications Section */}
                        {product.specification && Object.keys(product.specification).length > 0 && (
                          <div className="pt-12 border-t border-black/5">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-black/30">Technical Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                              {Object.entries(product.specification).map(([key, value]) => (
                                <div key={key} className="flex flex-col space-y-1">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{key}</span>
                                  <span className="text-sm font-medium text-black/80">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-10"
                        >
                            {/* Header */}
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent px-3 py-1 bg-brand-accent/5 rounded-full inline-block">
                                        {product.categories?.name}
                                    </span>
                                    <div className="flex items-center space-x-2 bg-brand-gray px-3 py-1.5 rounded-full">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-[10px] font-bold">{product.rating}</span>
                                        <span className="text-[10px] text-black/40">({product.reviews_count} reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-6 tracking-tighter uppercase italic">
                                    {product.title}
                                </h1>

                                <div className="flex items-center gap-4">
                                    {product.offer_price ? (
                                      <>
                                        <span className="text-4xl font-serif font-bold text-red-500">
                                            {formatCurrency(product.offer_price)}
                                        </span>
                                        <span className="text-xl font-medium text-black/20 line-through">
                                            {formatCurrency(product.price)}
                                        </span>
                                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded">
                                          {Math.round((1 - (product.offer_price / product.price)) * 100)}% OFF
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-4xl font-serif font-bold">
                                          {formatCurrency(product.price)}
                                      </span>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-sm max-w-none text-black/60 leading-relaxed font-medium">
                                <p className="text-base whitespace-pre-line">{product.description}</p>
                            </div>

                            {/* Variants (Colors) */}
                            {product.variants && product.variants.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 block">Selection / {product.variants[selectedVariant]?.color}</span>
                                <div className="flex gap-4">
                                  {product.variants.map((variant, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setSelectedVariant(idx)}
                                      className={cn(
                                        "w-10 h-10 rounded-full border-2 transition-all p-0.5",
                                        selectedVariant === idx ? "border-brand-accent scale-110" : "border-transparent hover:border-black/10"
                                      )}
                                      title={variant.color}
                                    >
                                      <div
                                        className="w-full h-full rounded-full shadow-inner"
                                        style={{ backgroundColor: variant.hex }}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Size Selector */}
                            {product.sizes && product.sizes.length > 0 && (
                              <div>
                                  <div className="flex justify-between items-center mb-4">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Object Dimensions</span>
                                      <button className="text-[10px] uppercase font-bold text-black/30 hover:text-black transition-colors underline-offset-4 hover:underline">Guide</button>
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                      {product.sizes.map((size) => (
                                          <button
                                              key={size}
                                              onClick={() => setSelectedSize(size)}
                                              className={cn(
                                                "min-w-[60px] h-12 rounded-lg text-xs font-bold transition-all border uppercase tracking-widest flex items-center justify-center",
                                                selectedSize === size
                                                      ? 'bg-brand-black text-white border-brand-black shadow-lg shadow-black/10 scale-105'
                                                      : 'bg-white text-black/50 border-black/5 hover:border-black/20'
                                              )}
                                          >
                                              {size}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-4 pt-4">
                                {product.affiliate_link ? (
                                  <button
                                      onClick={handleAffiliateClick}
                                      className="w-full bg-brand-accent text-white py-6 px-8 rounded-xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center shadow-xl shadow-brand-accent/20 group"
                                  >
                                      Enquire Availability <ExternalLink className="ml-4 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                  </button>
                                ) : (
                                  <button
                                      className="w-full bg-brand-black text-white py-6 px-8 rounded-xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-brand-accent transition-all flex items-center justify-center shadow-xl shadow-black/10 group"
                                  >
                                      <ShoppingBag className="w-4 h-4 mr-4 group-hover:-translate-y-1 transition-transform" /> Add to Collection
                                  </button>
                                )}

                                <div className="flex gap-4">
                                  <button className="flex-1 h-16 rounded-xl border border-black/5 flex items-center justify-center hover:bg-brand-gray transition-all text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black">
                                      <Heart className="w-4 h-4 mr-3" /> Save to Wishlist
                                  </button>
                                  <button className="w-16 h-16 rounded-xl border border-black/5 flex items-center justify-center hover:bg-brand-gray transition-all text-black/60">
                                      <Share2 className="w-4 h-4" />
                                  </button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-brand-gray rounded-2xl">
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                      <Truck className="w-5 h-5 text-brand-accent" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/60 leading-tight">Secured Global Dispatch</span>
                                </div>
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                      <RefreshCw className="w-5 h-5 text-brand-accent" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/60 leading-tight">30-Day Archive Return</span>
                                </div>
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                      <ShieldCheck className="w-5 h-5 text-brand-accent" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/60 leading-tight">Certified Authenticity</span>
                                </div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </main>
    );
}
