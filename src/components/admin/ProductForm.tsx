import React, { useState } from 'react';
import { 
  X, Save, Image as ImageIcon, Plus, 
  Trash2, Link as LinkIcon, Info, Settings,
  Palette, Maximize, DollarSign, Wand2, Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../types';
import { cn } from '../../lib/utils';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ product, categories, onClose, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media'>('basic');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  
  const [formData, setFormData] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    offer_price: product?.offer_price || '',
    category_id: product?.category_id || '',
    affiliate_link: product?.affiliate_link || '',
    featured_image: product?.featured_image || '',
    stock_status: product?.stock_status || 'in_stock',
    is_new: product?.is_new || false,
    is_popular: product?.is_popular || false,
  });

  const [specification, setSpecification] = useState(
    product?.specification ? Object.entries(product.specification) : [['Material', ''], ['Fit', '']]
  );

  const [variants, setVariants] = useState(
    product?.variants || []
  );

  const [sizes, setSizes] = useState(
    product?.sizes || ['S', 'M', 'L', 'XL']
  );

  const [images, setImages] = useState(
    product?.images || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const specObj = Object.fromEntries(specification.filter(([k, v]) => k && v));
    
    const payload = {
      ...formData,
      price: Number(formData.price),
      offer_price: formData.offer_price ? Number(formData.offer_price) : null,
      specification: specObj,
      variants,
      sizes,
      images,
    };

    const { error } = product 
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert([payload]);

    if (!error) {
      onSuccess();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  const addSpec = () => setSpecification([...specification, ['', '']]);
  const removeSpec = (index: number) => setSpecification(specification.filter((_, i) => i !== index));

  const addVariant = () => setVariants([...variants, { color: '', hex: '#000000' }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleMagicFill = async () => {
    if (!formData.affiliate_link) return;
    setIsFetchingUrl(true);
    try {
      const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(formData.affiliate_link)}`);
      const data = await res.json();
      
      if (data.status === 'success') {
        const metadata = data.data;
        setFormData(prev => ({
          ...prev,
          title: prev.title || metadata.title || '',
          description: prev.description || metadata.description || '',
          featured_image: prev.featured_image || metadata.image?.url || '',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-black/5 bg-white">
        <div>
          <h2 className="text-2xl font-serif font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">
            {product ? `ID: ${product.id}` : 'Create a fresh entry'}
          </p>
        </div>
        <button 
          type="button" 
          onClick={onClose}
          className="p-3 bg-brand-gray rounded-full hover:bg-black hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-brand-gray/50 p-2 gap-2 mx-6 mt-6 rounded-xl">
        {[
          { id: 'basic', label: 'Basic Info', icon: Info },
          { id: 'details', label: 'Specifications', icon: Settings },
          { id: 'media', label: 'Media & Links', icon: ImageIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-white shadow-sm text-black" : "text-black/40 hover:text-black"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8 max-w-2xl mx-auto">
          
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="e.g. Silk Evening Gown"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="silk-evening-gown"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                  placeholder="Describe the product craftsmanship, inspiration, and feel..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Category</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Stock Status</label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({...formData, stock_status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="pre_order">Pre-Order</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-1 text-orange-600">
                    <Tag className="w-3 h-3" /> Offer Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.offer_price}
                    onChange={(e) => setFormData({...formData, offer_price: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl border border-orange-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-8 px-2 py-4 bg-brand-gray rounded-2xl">
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <input type="checkbox" checked={formData.is_new} onChange={e => setFormData({...formData, is_new: e.target.checked})} className="w-5 h-5 rounded-md border-black/10 text-black focus:ring-black" />
                   <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-black">Mark as New Arrival</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <input type="checkbox" checked={formData.is_popular} onChange={e => setFormData({...formData, is_popular: e.target.checked})} className="w-5 h-5 rounded-md border-black/10 text-black focus:ring-black" />
                   <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-black">Mark as Popular</span>
                 </label>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Specifications */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/40">Technical Specifications</h3>
                  <button type="button" onClick={addSpec} className="text-[10px] font-bold uppercase text-brand-accent flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Spec
                  </button>
                </div>
                <div className="grid gap-3">
                  {specification.map((spec, i) => (
                    <div key={i} className="flex gap-3 group">
                      <input
                        type="text"
                        value={spec[0]}
                        onChange={(e) => {
                          const newSpec = [...specification];
                          newSpec[i][0] = e.target.value;
                          setSpecification(newSpec);
                        }}
                        className="flex-1 px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none"
                        placeholder="Property (e.g. Material)"
                      />
                      <input
                        type="text"
                        value={spec[1]}
                        onChange={(e) => {
                          const newSpec = [...specification];
                          newSpec[i][1] = e.target.value;
                          setSpecification(newSpec);
                        }}
                        className="flex-1 px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none"
                        placeholder="Value (e.g. 100% Cotton)"
                      />
                      <button type="button" onClick={() => removeSpec(i)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/40">Color Variants</h3>
                  <button type="button" onClick={addVariant} className="text-[10px] font-bold uppercase text-brand-accent flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Variant
                  </button>
                </div>
                <div className="grid gap-3">
                  {variants.map((variant, i) => (
                    <div key={i} className="flex gap-3 items-center">
                       <input
                         type="text"
                         value={variant.color}
                         onChange={(e) => {
                           const newVariants = [...variants];
                           newVariants[i].color = e.target.value;
                           setVariants(newVariants);
                         }}
                         className="flex-1 px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none"
                         placeholder="Color name (e.g. Midnight Black)"
                       />
                       <input
                         type="color"
                         value={variant.hex}
                         onChange={(e) => {
                           const newVariants = [...variants];
                           newVariants[i].hex = e.target.value;
                           setVariants(newVariants);
                         }}
                         className="w-12 h-12 bg-transparent cursor-pointer rounded-xl overflow-hidden border-none"
                       />
                       <button type="button" onClick={() => removeVariant(i)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/40">Available Sizes</h3>
                 <div className="flex flex-wrap gap-3">
                   {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].map(size => (
                     <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={cn(
                          "px-6 py-3 rounded-xl text-xs font-bold transition-all border",
                          sizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-black border-black/5 hover:border-black/20"
                        )}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-8">
               <div className="space-y-4">
                 <div className="flex items-center gap-2 text-black/40">
                   <ImageIcon className="w-4 h-4" />
                   <h3 className="text-[10px] font-bold uppercase tracking-widest">Visual Assets</h3>
                 </div>
                 <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Featured Image URL</label>
                      <input
                        type="text"
                        required
                        value={formData.featured_image}
                        onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        className="w-full px-4 py-3 bg-brand-gray/50 rounded-xl text-sm focus:outline-none"
                        placeholder="https://images.unsplash.com/..."
                      />
                   </div>
                   {formData.featured_image && (
                     <div className="aspect-video relative rounded-2xl overflow-hidden bg-brand-gray border border-black/5">
                        <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                   )}
                 </div>
               </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-accent">
                    <LinkIcon className="w-4 h-4" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Affiliate Integration</h3>
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">Direct Affiliate Link</label>
                      <input
                        type="text"
                        value={formData.affiliate_link}
                        onChange={(e) => setFormData({...formData, affiliate_link: e.target.value})}
                        className="w-full px-4 py-3 bg-brand-gray/50 border border-brand-accent/20 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-all hover:bg-white"
                        placeholder="https://amazon.com/affiliate-link-here..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleMagicFill}
                      disabled={isFetchingUrl || !formData.affiliate_link}
                      className={cn(
                        "h-[46px] px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm",
                        !formData.affiliate_link 
                          ? "bg-brand-gray text-black/20 cursor-not-allowed" 
                          : "bg-brand-accent text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98]"
                      )}
                    >
                      {isFetchingUrl ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Magic Fill</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[9px] text-black/40 font-medium italic">Paste an affiliate link above and use <b>Magic Fill</b> to automatically pull product details, price, and images.</p>
                </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-black/5 bg-white flex justify-end gap-3 mt-auto">
        <button
          type="button"
          onClick={onClose}
          className="px-8 py-4 bg-brand-gray rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-12 py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all flex items-center gap-2 shadow-xl shadow-black/10 disabled:opacity-50"
        >
          {loading ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-4 h-4" />
              {product ? 'Update Inventory' : 'Add to Catalog'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
