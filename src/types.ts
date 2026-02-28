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
  formatted_price: string;
  image_url: string;
  category: string;
  is_new: boolean;
  is_popular: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
}
