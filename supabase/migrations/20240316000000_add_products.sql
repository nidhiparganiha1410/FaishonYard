-- Migration: Add Products Table
-- Created: 2026-03-16

CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  specification JSONB DEFAULT '{}'::jsonb, -- e.g. {"Material": "Silk", "Fit": "Regular"}
  variants JSONB DEFAULT '[]'::jsonb, -- e.g. [{"color": "Black", "hex": "#000"}]
  sizes TEXT[] DEFAULT '{}'::text[], -- e.g. ['S', 'M', 'L']
  price DECIMAL(10,2) NOT NULL,
  offer_price DECIMAL(10,2),
  featured_image TEXT,
  images TEXT[] DEFAULT '{}'::text[],
  category_id BIGINT REFERENCES public.categories(id),
  affiliate_link TEXT,
  is_new BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'pre_order')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (is_admin());

-- Create index for performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
