import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Video } from '../../lib/supabase';
import { ArrowLeft, ThumbsUp, Share2, Eye, Clock } from 'lucide-react';
import './Watch.css';

export function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  async function fetchVideo() {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*, category:categories(*), sub_category:sub_categories(*)')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (!error && data) {
        setVideo(data as Video);

        await supabase
          .from('videos')
          .update({ views: (data as Video).views + 1 })
          .eq('id', id);

        if ((data as Video).category_id) {
          const { data: related } = await supabase
            .from('videos')
            .select('*, category:categories(*), sub_category:sub_categories(*)')
            .eq('is_published', true)
            .eq('category_id', (data as Video).category_id)
            .neq('id', id)
            .limit(6);
          setRelatedVideos((related as Video[]) || []);
        }
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="watch-page">
        <div className="container">
          <div className="video-player-skeleton skeleton" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="watch-page">
        <div className="container not-found">
          <h1>Video Not Found</h1>
          <p>The video you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="back-btn">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="container">
        <div className="watch-layout">
          <div className="watch-main">
            <Link to="/" className="back-link">
              <ArrowLeft size={18} />
              <span>Back to Browse</span>
            </Link>

            <div className="video-player-wrapper">
              <div ref={playerRef} className="video-player">
                <video
                  src={video.video_url}
                  controls
                  autoPlay
                  poster={video.thumbnail_url || undefined}
                  className="video-element"
                >
                  <source src={video.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <div className="video-details">
              <div className="video-tags">
                {video.category && <span className="category-tag">{video.category.name}</span>}
                {video.sub_category && <span className="genre-tag">{video.sub_category.name}</span>}
                {video.is_age_restricted && <span className="age-restricted-tag">18+</span>}
              </div>

              <h1 className="video-detail-title">{video.title}</h1>

              <div className="video-stats">
                <span className="stat-item">
                  <Eye size={16} />
                  {formatViews(video.views)} views
                </span>
                <span className="stat-item">
                  <Clock size={16} />
                  {formatDate(video.created_at)}
                </span>
              </div>

              {video.description && (
                <div className="video-description">
                  <h3>Description</h3>
                  <p>{video.description}</p>
                </div>
              )}

              <div className="video-actions">
                <button className="action-btn like-btn">
                  <ThumbsUp size={20} />
                  <span>Like</span>
                </button>
                <button className="action-btn share-btn">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {relatedVideos.length > 0 && (
            <div className="watch-sidebar">
              <h3>Related Videos</h3>
              <div className="related-list">
                {relatedVideos.map((v) => (
                  <Link key={v.id} to={`/watch/${v.id}`} className="related-item">
                    <div className="related-thumbnail">
                      <img src={v.thumbnail_url || 'https://images.pexels.com/videos/3614522/pexels-photo-3614522.jpeg?auto=compress&cs=tinysrgb&w=400'} alt={v.title} />
                    </div>
                    <div className="related-info">
                      <h4>{v.title}</h4>
                      <span className="related-views">{formatViews(v.views)} views</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
