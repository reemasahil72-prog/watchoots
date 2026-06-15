import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Video, Category, SubCategory } from '../../lib/supabase';
import { VideoGrid } from '../../components/VideoGrid/VideoGrid';
import { Filter } from 'lucide-react';
import './Category.css';

export function Category() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get('genre') || '');

  const sort = searchParams.get('sort') || 'recent';

  useEffect(() => {
    fetchCategoryData();
  }, [slug, sort, selectedGenre]);

  async function fetchCategoryData() {
    setLoading(true);
    try {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (catData) {
        setCategory(catData as Category);
      }

      let query = supabase
        .from('videos')
        .select('*, category:categories(*), sub_category:sub_categories(*)')
        .eq('is_published', true);

      if (slug && slug !== 'all') {
        query = query.eq('category_id', catData?.id);
      }

      if (selectedGenre) {
        const { data: subCatData } = await supabase
          .from('sub_categories')
          .select('id')
          .eq('slug', selectedGenre)
          .single();
        if (subCatData) {
          query = query.eq('sub_category_id', subCatData.id);
        }
      }

      if (sort === 'trending') {
        query = query.order('views', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: videoData } = await query.limit(50);
      setVideos(videoData || []);

      const { data: subCatsData } = await supabase.from('sub_categories').select('*').order('name');
      setSubCategories((subCatsData as SubCategory[]) || []);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSortChange = (newSort: string) => {
    setSearchParams(params => {
      params.set('sort', newSort);
      if (selectedGenre) params.set('genre', selectedGenre);
      return params;
    });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setSearchParams(params => {
      if (genre) {
        params.set('genre', genre);
      } else {
        params.delete('genre');
      }
      params.set('sort', sort);
      return params;
    });
  };

  const categoryTitle = category?.name || 'All Content';

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-header">
          <div className="category-title-section">
            <h1 className="category-title">{categoryTitle}</h1>
            {slug === 'adult' && <span className="adult-badge">18+</span>}
          </div>

          <div className="filters">
            <div className="filter-group">
              <Filter size={18} />
              <span>Filters:</span>
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${!selectedGenre ? 'active' : ''}`}
                onClick={() => handleGenreChange('')}
              >
                All Genres
              </button>
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  className={`filter-btn ${selectedGenre === sub.slug ? 'active' : ''}`}
                  onClick={() => handleGenreChange(sub.slug)}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            <div className="sort-buttons">
              <button
                className={`sort-btn ${sort === 'recent' ? 'active' : ''}`}
                onClick={() => handleSortChange('recent')}
              >
                Recent
              </button>
              <button
                className={`sort-btn ${sort === 'trending' ? 'active' : ''}`}
                onClick={() => handleSortChange('trending')}
              >
                Trending
              </button>
            </div>
          </div>
        </div>

        <VideoGrid videos={videos} loading={loading} />
      </div>
    </div>
  );
}
