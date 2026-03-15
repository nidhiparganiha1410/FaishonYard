import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard, FileText, FolderTree, Users, Settings, ExternalLink, Plus, Search,
  Edit, Trash, X, Check, Eye, EyeOff, Save, ArrowLeft, Image, Link2, Globe, ChevronDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Post, Profile, Category } from '../types';
import { cn, formatDate } from '../lib/utils';
import ImageWithFallback from '../components/ImageWithFallback';

// ─── Post Editor Sub-component ───────────────────────────────────────────────
function PostEditor({ post, categories, onSave, onCancel }: {
  post: Partial<Post> | null;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    featured_image: post?.featured_image || '',
    category_id: post?.category_id || (categories[0]?.id ?? 1),
    status: post?.status || 'draft' as string,
    is_featured: post?.is_featured || false,
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    read_time: post?.read_time || 5,
    content: post?.content ? JSON.stringify(post.content, null, 2) : '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  async function handleSave() {
    if (!form.title || !form.slug) { setError('Title and Slug are required'); return; }
    setSaving(true);
    setError('');

    const payload: any = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      featured_image: form.featured_image,
      category_id: form.category_id,
      status: form.status,
      is_featured: form.is_featured,
      meta_title: form.meta_title || form.title,
      meta_description: form.meta_description || form.excerpt,
      read_time: form.read_time,
      content: form.content ? JSON.parse(form.content) : null,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    };

    let result;
    if (post?.id) {
      result = await supabase.from('posts').update(payload).eq('id', post.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      payload.author_id = user?.id;
      result = await supabase.from('posts').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSave();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button onClick={onCancel} className="flex items-center text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
        </button>
        <div className="flex items-center space-x-4">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-4 py-3 bg-white border border-black/10 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : (post?.id ? 'Update' : 'Create')}
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-black/5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 block">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: post?.id ? form.slug : autoSlug(e.target.value) })}
              className="w-full text-3xl font-serif font-bold border-none focus:outline-none placeholder:text-black/15"
              placeholder="Enter article title..."
            />
          </div>

          <div className="bg-white p-8 rounded-2xl border border-black/5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 block">Slug</label>
            <div className="flex items-center space-x-2">
              <span className="text-black/30 text-sm">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="flex-1 border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-black/5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 block">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent min-h-[100px] resize-none"
              placeholder="Brief summary of the article..."
            />
          </div>

          <div className="bg-white p-8 rounded-2xl border border-black/5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 block">Content (JSON)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-black/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-brand-accent min-h-[300px] resize-y"
              placeholder='{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Your article text..."}]}]}'
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-black/5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 block">Featured Image URL</label>
            <input
              type="text"
              value={form.featured_image}
              onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent mb-4"
              placeholder="https://images.unsplash.com/..."
            />
            {form.featured_image && (
              <div className="aspect-video rounded-xl overflow-hidden bg-brand-gray">
                <ImageWithFallback src={form.featured_image || ''} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-black/5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3 block">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
              className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent"
            >
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-black/5 space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">Read Time (min)</label>
            <input
              type="number"
              value={form.read_time}
              onChange={(e) => setForm({ ...form, read_time: Number(e.target.value) })}
              className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
              min="1"
            />

            <label className="flex items-center space-x-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-xs font-bold uppercase tracking-widest">Featured Article</span>
            </label>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-black/5 space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">SEO</label>
            <input
              type="text"
              value={form.meta_title}
              onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
              placeholder="Meta Title"
            />
            <input
              type="text"
              value={form.meta_description}
              onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
              placeholder="Meta Description"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>({ totalPosts: 0, totalUsers: 0, totalViews: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Article states
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<Partial<Post> | null | 'new'>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Category states
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null | 'new'>(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', image_url: '' });

  // Affiliate states
  const [editingAffiliate, setEditingAffiliate] = useState<any | null | 'new'>(null);
  const [affForm, setAffForm] = useState({ slug: '', destination_url: '' });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        window.location.href = '/';
        return;
      }

      const [postsRes, catsRes, usersRes, affRes] = await Promise.all([
        supabase.from('posts').select('*, categories(*), profiles(*)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('affiliate_links').select('*').order('created_at', { ascending: false }),
      ]);
      
      if (postsRes.data) setPosts(postsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (affRes.data) setAffiliates(affRes.data);

      // Compute stats
      const totalPosts = postsRes.data?.length || 0;
      const totalUsers = usersRes.data?.length || 0;
      const totalViews = postsRes.data?.reduce((s, p) => s + (p.view_count || 0), 0) || 0;
      setStats({ totalPosts, totalUsers, totalViews });
    } catch (err) {
      console.error('Admin unauthorized:', err);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }

  // ─── ARTICLE CRUD ──────────────────────────────────────────────────────────
  async function handleDeletePost(id: string) {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      setDeleteConfirm(null);
      fetchAll();
    } catch (err: any) {
      alert(`Failed to delete article: ${err.message}`);
    }
  }

  async function handleToggleStatus(post: Post) {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      const { error } = await supabase.from('posts').update({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      }).eq('id', post.id);
      if (error) throw error;
      fetchAll();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  }

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── CATEGORY CRUD ─────────────────────────────────────────────────────────
  function startEditCategory(cat: Category) {
    setEditingCategory(cat);
    setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', image_url: cat.image_url || '' });
  }

  async function handleSaveCategory() {
    if (!catForm.name || !catForm.slug) return;
    try {
      if (editingCategory === 'new') {
        const { error } = await supabase.from('categories').insert(catForm);
        if (error) throw error;
      } else if (editingCategory && typeof editingCategory !== 'string') {
        const { error } = await supabase.from('categories').update(catForm).eq('id', editingCategory.id);
        if (error) throw error;
      }
      setEditingCategory(null);
      setCatForm({ name: '', slug: '', description: '', image_url: '' });
      fetchAll();
    } catch (err: any) {
      alert(`Failed to save category: ${err.message}`);
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchAll();
    } catch (err: any) {
      alert(`Failed to delete category (it may contain posts): ${err.message}`);
    }
  }

  // ─── AFFILIATE CRUD ────────────────────────────────────────────────────────
  async function handleSaveAffiliate() {
    if (!affForm.slug || !affForm.destination_url) return;
    try {
      if (editingAffiliate === 'new') {
        const { error } = await supabase.from('affiliate_links').insert(affForm);
        if (error) throw error;
      } else if (editingAffiliate && typeof editingAffiliate !== 'string') {
        const { error } = await supabase.from('affiliate_links').update(affForm).eq('id', editingAffiliate.id);
        if (error) throw error;
      }
      setEditingAffiliate(null);
      setAffForm({ slug: '', destination_url: '' });
      fetchAll();
    } catch (err: any) {
      alert(`Failed to save affiliate: ${err.message}`);
    }
  }

  async function handleDeleteAffiliate(id: string) {
    try {
      const { error } = await supabase.from('affiliate_links').delete().eq('id', id);
      if (error) throw error;
      fetchAll();
    } catch (err: any) {
      alert(`Failed to delete affiliate: ${err.message}`);
    }
  }

  // ─── USER ROLE UPDATE ──────────────────────────────────────────────────────
  async function handleToggleUserRole(user: Profile) {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
      if (error) throw error;
      fetchAll();
    } catch (err: any) {
      alert(`Failed to update user role: ${err.message}`);
    }
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'affiliates', label: 'Affiliates', icon: ExternalLink },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-gray flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-black text-white flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-xl font-serif font-bold tracking-tighter uppercase">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setEditingPost(null); setEditingCategory(null); setEditingAffiliate(null); }}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === item.id ? "bg-white text-black" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center space-x-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors px-4 py-3">
            <Globe className="w-4 h-4" />
            <span>View Site</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">

        {/* ═══════════════ DASHBOARD TAB ═══════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-2">Overview</h1>
                <p className="text-black/40 text-xs font-bold uppercase tracking-widest">Performance metrics for Fashion Yard</p>
              </div>
              <button
                onClick={() => { setActiveTab('articles'); setEditingPost('new'); }}
                className="px-6 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all flex items-center"
              >
                <Plus className="mr-2 w-4 h-4" /> New Article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Total Posts', value: stats.totalPosts, color: 'text-blue-500' },
                { label: 'Total Users', value: stats.totalUsers, color: 'text-emerald-500' },
                { label: 'Page Views', value: stats.totalViews, color: 'text-violet-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 block">{stat.label}</span>
                  <div className={cn("text-4xl font-serif font-bold", stat.color)}>{stat.value.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8">Views Over Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Mon', views: 4000 }, { name: 'Tue', views: 3000 }, { name: 'Wed', views: 2000 },
                    { name: 'Thu', views: 2780 }, { name: 'Fri', views: 1890 }, { name: 'Sat', views: 2390 }, { name: 'Sun', views: 3490 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="views" fill="#050505" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Articles Quick List */}
            <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">Recent Articles</h3>
                <button onClick={() => setActiveTab('articles')} className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {posts.slice(0, 5).map(post => (
                  <div key={post.id} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-gray overflow-hidden flex-shrink-0">
                        <ImageWithFallback src={post.featured_image || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold line-clamp-1">{post.title}</div>
                        <div className="text-[10px] text-black/40">{formatDate(post.created_at)}</div>
                      </div>
                    </div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", post.status === 'published' ? "text-emerald-500" : "text-amber-500")}>
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ ARTICLES TAB ═══════════════ */}
        {activeTab === 'articles' && (
          editingPost ? (
            <PostEditor
              post={editingPost === 'new' ? null : editingPost as Post}
              categories={categories}
              onSave={() => { setEditingPost(null); fetchAll(); }}
              onCancel={() => setEditingPost(null)}
            />
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-serif font-bold">Articles</h1>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border border-black/5 rounded-full py-3 pl-12 pr-6 text-xs focus:outline-none focus:border-black/20 transition-all w-64"
                    />
                  </div>
                  <button
                    onClick={() => setEditingPost('new')}
                    className="px-6 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create New
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 bg-brand-gray/50">
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Article</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Category</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Status</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Views</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="border-b border-black/5 last:border-0 hover:bg-brand-gray/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-brand-gray overflow-hidden flex-shrink-0">
                              <ImageWithFallback src={post.featured_image || ''} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-sm font-bold line-clamp-1">{post.title}</div>
                              <div className="text-[10px] text-black/40 uppercase tracking-widest">{post.profiles?.username} • {formatDate(post.created_at)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-brand-gray rounded-full">
                            {post.categories?.name}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <button
                            onClick={() => handleToggleStatus(post)}
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-widest flex items-center hover:opacity-70 transition-opacity cursor-pointer",
                              post.status === 'published' ? "text-emerald-500" : "text-amber-500"
                            )}
                            title="Click to toggle status"
                          >
                            {post.status === 'published' ? <Eye className="w-3 h-3 mr-1.5" /> : <EyeOff className="w-3 h-3 mr-1.5" />}
                            {post.status}
                          </button>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium">{(post.view_count || 0).toLocaleString()}</td>
                        <td className="px-8 py-6 text-right">
                          {deleteConfirm === post.id ? (
                            <div className="flex justify-end items-center space-x-2">
                              <span className="text-[10px] text-red-500 font-bold">Delete?</span>
                              <button onClick={() => handleDeletePost(post.id)} className="p-2 bg-red-500 text-white rounded-lg text-xs font-bold"><Check className="w-3 h-3" /></button>
                              <button onClick={() => setDeleteConfirm(null)} className="p-2 bg-brand-gray rounded-lg text-xs"><X className="w-3 h-3" /></button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => setEditingPost(post)} className="p-2 hover:bg-brand-gray rounded-lg transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteConfirm(post.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Delete"><Trash className="w-4 h-4" /></button>
                              <a href={`/blog/${post.slug}`} target="_blank" className="p-2 hover:bg-brand-gray rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></a>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredPosts.length === 0 && (
                      <tr><td colSpan={5} className="px-8 py-16 text-center text-black/30 text-sm">No articles found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* ═══════════════ CATEGORIES TAB ═══════════════ */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-serif font-bold">Categories</h1>
              <button
                onClick={() => { setEditingCategory('new'); setCatForm({ name: '', slug: '', description: '', image_url: '' }); }}
                className="px-6 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </button>
            </div>

            {/* Category Editor Modal */}
            {editingCategory && (
              <div className="bg-white p-8 rounded-2xl border border-brand-accent/30 shadow-lg space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                  {editingCategory === 'new' ? 'New Category' : `Edit: ${(editingCategory as Category).name}`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1 block">Name</label>
                    <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: editingCategory === 'new' ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') : catForm.slug })} className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1 block">Slug</label>
                    <input type="text" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1 block">Description</label>
                    <input type="text" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1 block">Image URL</label>
                    <input type="text" value={catForm.image_url} onChange={(e) => setCatForm({ ...catForm, image_url: e.target.value })} className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setEditingCategory(null)} className="px-6 py-2 text-xs font-bold uppercase tracking-widest border border-black/10 rounded-full hover:bg-brand-gray">Cancel</button>
                  <button onClick={handleSaveCategory} className="px-6 py-2 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black/80">Save</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex flex-col">
                  {cat.image_url && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-brand-gray">
                      <ImageWithFallback src={cat.image_url || ''} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-lg font-serif font-bold mb-1">{cat.name}</h3>
                  <p className="text-xs text-black/40 mb-2 uppercase tracking-widest">/{cat.slug}</p>
                  <p className="text-sm text-black/50 flex-1 line-clamp-2">{cat.description || 'No description'}</p>
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-black/5">
                    <button onClick={() => startEditCategory(cat)} className="p-2 hover:bg-brand-gray rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="col-span-full py-16 text-center text-black/30 text-sm">No categories yet. Create one to get started.</div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ USERS TAB ═══════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <h1 className="text-4xl font-serif font-bold">Users</h1>
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-brand-gray/50">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">User</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Role</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Joined</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-black/5 last:border-0 hover:bg-brand-gray/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-brand-gray overflow-hidden flex-shrink-0">
                            {user.avatar_url ? (
                              <ImageWithFallback src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-black/20 font-bold text-lg">{user.username?.[0]?.toUpperCase() || '?'}</div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{user.username || 'Unnamed'}</div>
                            <div className="text-[10px] text-black/40">{user.bio?.slice(0, 50) || 'No bio'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                          user.role === 'admin' ? "bg-violet-100 text-violet-600" : "bg-brand-gray text-black/50"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs text-black/40">{formatDate(user.created_at)}</td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleToggleUserRole(user)}
                          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-black/10 rounded-full hover:bg-brand-gray transition-colors"
                        >
                          {user.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={4} className="px-8 py-16 text-center text-black/30 text-sm">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ AFFILIATES TAB ═══════════════ */}
        {activeTab === 'affiliates' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-serif font-bold">Affiliate Links</h1>
              <button
                onClick={() => { setEditingAffiliate('new'); setAffForm({ slug: '', destination_url: '' }); }}
                className="px-6 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Link
              </button>
            </div>

            {editingAffiliate && (
              <div className="bg-white p-8 rounded-2xl border border-brand-accent/30 shadow-lg space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                  {editingAffiliate === 'new' ? 'New Affiliate Link' : 'Edit Link'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1 block">Slug (e.g. "nike-sale")</label>
                    <input type="text" value={affForm.slug} onChange={(e) => setAffForm({ ...affForm, slug: e.target.value })} className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1 block">Destination URL</label>
                    <input type="text" value={affForm.destination_url} onChange={(e) => setAffForm({ ...affForm, destination_url: e.target.value })} className="w-full border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent" placeholder="https://..." />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setEditingAffiliate(null)} className="px-6 py-2 text-xs font-bold uppercase tracking-widest border border-black/10 rounded-full hover:bg-brand-gray">Cancel</button>
                  <button onClick={handleSaveAffiliate} className="px-6 py-2 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black/80">Save</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-brand-gray/50">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Slug</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Destination</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Clicks</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-black/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map(aff => (
                    <tr key={aff.id} className="border-b border-black/5 last:border-0 hover:bg-brand-gray/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <Link2 className="w-4 h-4 text-brand-accent" />
                          <span className="text-sm font-bold">/go/{aff.slug}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-black/60 line-clamp-1 max-w-xs">{aff.destination_url}</td>
                      <td className="px-8 py-6 text-sm font-medium">{(aff.click_count || 0).toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => { setEditingAffiliate(aff); setAffForm({ slug: aff.slug, destination_url: aff.destination_url }); }} className="p-2 hover:bg-brand-gray rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteAffiliate(aff.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {affiliates.length === 0 && (
                    <tr><td colSpan={4} className="px-8 py-16 text-center text-black/30 text-sm">No affiliate links yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════ SETTINGS TAB ═══════════════ */}
        {activeTab === 'settings' && <SettingsPanel />}

      </main>
    </div>
  );
}

// ─── Settings Panel Sub-component ────────────────────────────────────────────
function SettingsPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'Fashion Yard',
    site_tagline: 'Luxury Editorial & Style Guide',
    contact_email: 'hello@fashionyard.com',
    facebook_url: 'https://www.facebook.com/jeet.parganiha.5',
    instagram_url: 'https://www.instagram.com/jeetparganiha/',
    twitter_url: 'https://x.com/jeetparganiha',
    linkedin_url: 'https://www.linkedin.com/in/jeet-parganiha-b92305116/',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.key] = s.value; });
        setSettings(prev => ({ ...prev, ...map }));
      }
    }
    loadSettings();
  }, []);

  async function handleSaveSettings() {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-4xl font-serif font-bold">Settings</h1>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">General</h3>
        {[
          { key: 'site_name', label: 'Site Name' },
          { key: 'site_tagline', label: 'Tagline' },
          { key: 'contact_email', label: 'Contact Email' },
        ].map(field => (
          <div key={field.key}>
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">{field.label}</label>
            <input
              type="text"
              value={settings[field.key] || ''}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Social Media</h3>
        {[
          { key: 'facebook_url', label: 'Facebook URL' },
          { key: 'instagram_url', label: 'Instagram URL' },
          { key: 'twitter_url', label: 'Twitter / X URL' },
          { key: 'linkedin_url', label: 'LinkedIn URL' },
        ].map(field => (
          <div key={field.key}>
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2 block">{field.label}</label>
            <input
              type="text"
              value={settings[field.key] || ''}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-accent"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-8 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all flex items-center disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center"><Check className="w-4 h-4 mr-1" /> Saved!</span>}
      </div>
    </div>
  );
}
