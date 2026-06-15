import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Video = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: number;
  category_id: string | null;
  sub_category_id: string | null;
  uploader_id: string | null;
  views: number;
  is_published: boolean;
  is_age_restricted: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  sub_category?: SubCategory;
};

export type Feedback = {
  id: string;
  name: string;
  email: string;
  city: string | null;
  remarks: string;
  created_at: string;
};
