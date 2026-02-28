import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, FileText, FolderTree, Users, Settings, ExternalLink, Plus, Search, MoreVertical, Edit, Trash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Post, Profile, Category } from '../types';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchPosts();
  }, []);

  async function fetchStats() {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setStats(data);
  }

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, categories(*), profiles(*)')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
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
      <aside className="w-64 bg-brand-black text-white flex flex-col">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-xl font-serif font-bold tracking-tighter uppercase">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-2">Overview</h1>
                <p className="text-black/40 text-xs font-bold uppercase tracking-widest">Performance metrics for Fashion Yard</p>
              </div>
              <button className="px-6 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all flex items-center">
                <Plus className="mr-2 w-4 h-4" /> New Article
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Total Posts', value: stats?.totalPosts || 0, color: 'bg-blue-500' },
                { label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-emerald-500' },
                { label: 'Page Views', value: stats?.totalViews || 0, color: 'bg-violet-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 block">{stat.label}</span>
                  <div className="text-4xl font-serif font-bold">{stat.value.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8">Views Over Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Mon', views: 4000 },
                    { name: 'Tue', views: 3000 },
                    { name: 'Wed', views: 2000 },
                    { name: 'Thu', views: 2780 },
                    { name: 'Fri', views: 1890 },
                    { name: 'Sat', views: 2390 },
                    { name: 'Sun', views: 3490 },
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
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-serif font-bold">Articles</h1>
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="bg-white border border-black/5 rounded-full py-3 pl-12 pr-6 text-xs focus:outline-none focus:border-black/20 transition-all w-64"
                  />
                </div>
                <button className="px-6 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Create New
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
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-black/5 last:border-0 hover:bg-brand-gray/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-brand-gray overflow-hidden flex-shrink-0">
                            <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-bold line-clamp-1">{post.title}</div>
                            <div className="text-[10px] text-black/40 uppercase tracking-widest">{post.profiles?.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-brand-gray rounded-full">
                          {post.categories?.name}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest flex items-center",
                          post.status === 'published' ? "text-emerald-500" : "text-amber-500"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full mr-2", post.status === 'published' ? "bg-emerald-500" : "bg-amber-500")} />
                          {post.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium">{post.view_count.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-2 hover:bg-brand-gray rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-brand-gray rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
