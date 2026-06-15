import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Video, Category } from '../../lib/supabase';
import { VideoGrid } from '../../components/VideoGrid/VideoGrid';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Clock } from 'lucide-react';
import './Home.css';

export function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  async function fetchHomeData() {
    try {
      const [featuredRes, trendingRes, recentRes, categoriesRes] = await Promise.all([
        supabase
          .from('videos')
          .select('*, category:categories(*), sub_category:sub_categories(*)')
          .eq('is_published', true)
          .order('views', { ascending: false })
          .limit(5),
        supabase
          .from('videos')
          .select('*, category:categories(*), sub_category:sub_categories(*)')
          .eq('is_published', true)
          .order('views', { ascending: false })
          .limit(12),
        supabase
          .from('videos')
          .select('*, category:categories(*), sub_category:sub_categories(*)')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(12),
        supabase.from('categories').select('*').order('name'),
      ]);

      setFeaturedVideos(featuredRes.data || []);
      setTrendingVideos((trendingRes.data || []).filter(v => !featuredRes.data?.some(f => f.id === v.id)));
      setRecentVideos(recentRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  }

  const featured = featuredVideos[0];

  if (loading) {
    return (
      <div className="home">
        <div className="hero-skeleton skeleton" />
        <div className="container">
          <VideoGrid videos={[]} loading title="Trending Now" />
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {featured && (
        <section className="hero" style={{ backgroundImage: `url(${featured.thumbnail_url || 'https://images.pexels.com/videos/3614522/pexels-photo-3614522.jpeg?auto=compress&cs=tinysrgb&w=1920'})` }}>
          <div className="hero-backdrop">
            <div className="hero-content container">
              <div className="hero-badge">Featured</div>
              <h1 className="hero-title">{featured.title}</h1>
              {featured.description && <p className="hero-description">{featured.description}</p>}
              <div className="hero-meta">
                {featured.category && <span className="hero-category">{featured.category.name}</span>}
                {featured.sub_category && <span className="hero-genre">{featured.sub_category.name}</span>}
              </div>
              <Link to={`/watch/${featured.id}`} className="hero-cta">
                Watch Now
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="container">
        <section className="categories-section">
          <h2 className="section-title">Browse Categories</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="category-card">
                <span className="category-name">{cat.name}</span>
                <ChevronRight size={20} />
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={24} />
              Trending Now
            </h2>
            <Link to="/category/all?sort=trending" className="see-all">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          <VideoGrid videos={trendingVideos} title="" />
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={24} />
              Recently Added
            </h2>
            <Link to="/category/all?sort=recent" className="see-all">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          <VideoGrid videos={recentVideos} title="" />
        </section>
      </div>
    </div>
  );
}
