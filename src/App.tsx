import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const AffiliateDisclosure = React.lazy(() => import('./pages/AffiliateDisclosure'));
import AdminDashboard from './pages/AdminDashboard';
import Shop from './pages/Shop';
import Chatbot from './components/Chatbot';
import SubscriptionPopup from './components/SubscriptionPopup';
import { supabase } from './lib/supabase';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple router
  const renderPage = () => {
    if (path === '/') return <Home />;
    if (path === '/shop') return <Shop />;
    if (path.startsWith('/blog/')) return <PostDetail slug={path.split('/')[2]} />;
    if (path === '/login') return <Login />;
    if (path === '/signup') return <Signup />;
    if (path.startsWith('/admin')) return <AdminDashboard />;
    if (path === '/about') return <About />;
    if (path === '/contact') return <Contact />;
    if (path === '/privacy-policy') return <PrivacyPolicy />;
    if (path === '/affiliate-disclosure') return <AffiliateDisclosure />;
    return <Home />; // Fallback
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-serif text-2xl animate-pulse text-brand-black">Loading...</div>}>
          {renderPage()}
        </React.Suspense>
      </div>
      <Footer />
      <Chatbot />
      <SubscriptionPopup />
    </div>
  );
}
