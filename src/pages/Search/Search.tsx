import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Video } from '../../lib/supabase';
import { VideoGrid } from '../../components/VideoGrid/VideoGrid';
import { Search } from 'lucide-react';
import './Search.css';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchPerformed(true);
    try {
      const { data, error } = await supabase.rpc('search_videos', { search_query: searchQuery.trim() });
      if (!error && data) {
        setVideos(data as Video[]);
      }
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query);
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-hero">
          <h1>Search Content</h1>
          <p>Find your favorite movies, series, and more</p>
        </div>

        <form onSubmit={handleSubmit} className="search-form-large">
          <div className="search-input-large-wrapper">
            <Search size={24} />
            <input
              type="text"
              placeholder="Search for videos, movies, series..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input-large"
            />
          </div>
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>

        {searchPerformed && (
          <div className="search-results">
            <div className="results-header">
              <h2>
                {loading ? 'Searching...' : `${videos.length} results for "${searchParams.get('q')}"`}
              </h2>
            </div>
            <VideoGrid videos={videos} loading={loading} />
          </div>
        )}

        {!searchPerformed && (
          <div className="search-suggestions">
            <h3>Popular Searches</h3>
            <div className="suggestion-tags">
              <button onClick={() => { setQuery('action'); setSearchParams({ q: 'action' }); performSearch('action'); }}>Action</button>
              <button onClick={() => { setQuery('comedy'); setSearchParams({ q: 'comedy' }); performSearch('comedy'); }}>Comedy</button>
              <button onClick={() => { setQuery('drama'); setSearchParams({ q: 'drama' }); performSearch('drama'); }}>Drama</button>
              <button onClick={() => { setQuery('thriller'); setSearchParams({ q: 'thriller' }); performSearch('thriller'); }}>Thriller</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
