export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  bio: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any; // TipTap JSON
  excerpt: string;
  featured_image: string;
  author_id: string;
  category_id: number;
  status: 'draft' | 'published' | 'scheduled';
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
  og_image: string;
  read_time: number;
  view_count: number;
  created_at: string;
  published_at: string;
  bullet_points: string[];
  profiles?: Profile;
  categories?: Category;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  offer_price?: number;
  specification: Record<string, string>;
  variants: Array<{ color: string; hex: string }>;
  sizes: string[];
  featured_image: string;
  images: string[];
  category_id: number;
  affiliate_link?: string;
  is_new: boolean;
  is_popular: boolean;
  rating: number;
  reviews_count: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'pre_order';
  created_at: string;
}
