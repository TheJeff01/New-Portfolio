export type ProjectCategory = "Wordpress" | "Web Dev";

export type ProjectStatus = "Completed" | "Ongoing";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tech_stack: string[];
  gradient: string;
  icon: string;
  long_description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  images?: string[];
  banner_url?: string;
  live_url?: string;
  repo_url?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  views: string;
  likes: string;
  gradient: string;
  tag: string;
  duration: string;
  video_url?: string;
  thumbnail_url?: string;
  orientation?: "portrait" | "landscape";
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InstagramPost {
  id: string;
  gradient: string;
  likes: string;
  caption: string;
  image_url?: string;
  sort_order?: number;
  created_at?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  read_time: string;
  gradient: string;
  tag: string;
  is_archived: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  gradient: string;
  sort_order?: number;
  created_at?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Profile {
  id?: string;
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  interests: string[];
  social_links: SocialLink[];
  updated_at?: string;
}
