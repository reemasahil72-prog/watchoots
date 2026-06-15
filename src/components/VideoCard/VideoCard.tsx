import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import type { Video } from '../../lib/supabase';
import './VideoCard.css';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const thumbnail = video.thumbnail_url || `https://images.pexels.com/videos/3614522/pexels-photo-3614522.jpeg?auto=compress&cs=tinysrgb&w=800`;

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Link to={`/watch/${video.id}`} className="video-card">
      <div className="video-thumbnail">
        <img src={thumbnail} alt={video.title} loading="lazy" />
        <div className="video-overlay">
          <Play className="play-icon" size={48} />
        </div>
        {video.duration > 0 && (
          <span className="video-duration">{formatDuration(video.duration)}</span>
        )}
        {video.is_age_restricted && <span className="age-badge">18+</span>}
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          <span className="meta-item">
            <Eye size={14} />
            {formatViews(video.views)} views
          </span>
          {video.category && (
            <span className="meta-item category-badge">
              {video.category.name}
            </span>
          )}
        </div>
        {video.sub_category && (
          <span className="genre-tag">{video.sub_category.name}</span>
        )}
      </div>
    </Link>
  );
}
