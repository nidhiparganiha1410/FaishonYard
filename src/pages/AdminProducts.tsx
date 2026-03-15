import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, 
  Tag, Package, ArrowLeft, Filter, MoreVertical,
  ChevronRight, ShoppingBag
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import ProductForm from '../components/admin/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-brand-gray/30 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-black/40 mb-2">
              <Package className="w-4 h-4" />
              <ChevronRight className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Inventory</span>
            </div>
            <h1 className="text-4xl font-serif font-bold">Product Management</h1>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'text-blue-600' },
            { label: 'Total Stock Value', value: formatCurrency(products.reduce((acc, p) => acc + Number(p.price), 0)), icon: Tag, color: 'text-green-600' },
            { label: 'Active Promotions', value: products.filter(p => p.offer_price).length, icon: Filter, color: 'text-orange-600' },
            { label: 'Out of Stock', value: products.filter(p => p.stock_status === 'out_of_stock').length, icon: Trash2, color: 'text-red-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-black/5 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-gray-50", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1">{stat.label}</span>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-black/5 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
            <input
              type="text"
              placeholder="Search products by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 font-medium"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-brand-gray/50 rounded-xl text-sm font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="py-20 text-center font-serif text-xl animate-pulse">Loading Inventory...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-black/5">
              <Package className="w-12 h-12 text-black/10 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">No products found</h3>
              <p className="text-sm text-black/40">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-black/5 group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                  <div className="aspect-square relative overflow-hidden bg-brand-gray">
                    <img src={product.featured_image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setIsFormOpen(true);
                        }}
                        className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full hover:bg-black hover:text-white transition-all transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full hover:bg-red-500 hover:text-white transition-all transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {product.is_new && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-brand-accent text-white text-[9px] font-bold uppercase tracking-widest rounded-full">New Arrival</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-brand-accent">
                         {product.category_id}
                       </span>
                       <div className="flex items-center text-xs font-bold">
                         {product.offer_price ? (
                           <>
                             <span className="text-red-500 mr-2">{formatCurrency(product.offer_price)}</span>
                             <span className="text-black/30 line-through">{formatCurrency(product.price)}</span>
                           </>
                         ) : (
                           <span>{formatCurrency(product.price)}</span>
                         )}
                       </div>
                    </div>
                    <h3 className="font-serif font-bold text-lg mb-4 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      <div className="flex gap-1">
                        {product.variants.slice(0, 3).map((v, i) => (
                          <div key={i} className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: v.hex }} title={v.color} />
                        ))}
                        {product.variants.length > 3 && <span className="text-[8px] font-bold text-black/30">+{product.variants.length - 3}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {product.affiliate_link && <ExternalLink className="w-3 h-3 text-black/20" />}
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                          product.stock_status === 'in_stock' ? "bg-green-100 text-green-700" : 
                          product.stock_status === 'out_of_stock' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                        )}>
                          {product.stock_status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
               <ProductForm 
                  product={editingProduct} 
                  categories={categories}
                  onClose={() => setIsFormOpen(false)} 
                  onSuccess={() => {
                    setIsFormOpen(false);
                    fetchData();
                  }} 
               />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
