import type { Video } from '../../lib/supabase';
import { VideoCard } from '../VideoCard/VideoCard';
import './VideoGrid.css';

interface VideoGridProps {
  videos?: Video[];
  loading?: boolean;
  title?: string;
}

export function VideoGrid({ videos, loading, title }: VideoGridProps) {
  if (loading) {
    return (
      <div className="video-grid-container">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="video-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="video-card-skeleton">
              <div className="skeleton thumbnail-skeleton" />
              <div className="skeleton-content">
                <div className="skeleton title-skeleton" />
                <div className="skeleton meta-skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="video-grid-container">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="no-videos">
          <p>No videos found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-grid-container">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
