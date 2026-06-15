import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Video, Feedback } from '../../lib/supabase';
import { Video as VideoIcon, MessageSquare, TrendingUp, Eye, Trash2, Check, X } from 'lucide-react';
import './Admin.css';

export function Admin() {
  const { user, isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [pendingVideos, setPendingVideos] = useState<Video[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, pendingCount: 0, feedbackCount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'pending' | 'feedback'>('videos');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (profile && !isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, isAdmin, profile, navigate]);

  async function fetchData() {
    try {
      const [videosRes, pendingRes, feedbackRes] = await Promise.all([
        supabase
          .from('videos')
          .select('*, category:categories(*), sub_category:sub_categories(*)')
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('videos')
          .select('*, category:categories(*), sub_category:sub_categories(*)')
          .eq('is_published', false)
          .order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(50),
      ]);

      setVideos((videosRes.data as Video[]) || []);
      setPendingVideos((pendingRes.data as Video[]) || []);
      setFeedback((feedbackRes.data as Feedback[]) || []);

      const totalViews = (videosRes.data || []).reduce((sum: number, v: Video) => sum + v.views, 0);
      setStats({
        totalVideos: (videosRes.data || []).length,
        totalViews,
        pendingCount: (pendingRes.data || []).length,
        feedbackCount: (feedbackRes.data || []).length,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (videoId: string) => {
    await supabase.from('videos').update({ is_published: true }).eq('id', videoId);
    fetchData();
  };

  const handleDelete = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await supabase.from('videos').delete().eq('id', videoId);
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="admin-loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your streaming platform</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><VideoIcon size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalVideos}</span>
              <span className="stat-label">Total Videos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Eye size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalViews.toLocaleString()}</span>
              <span className="stat-label">Total Views</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><TrendingUp size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.pendingCount}</span>
              <span className="stat-label">Pending Videos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><MessageSquare size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.feedbackCount}</span>
              <span className="stat-label">Feedback</span>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Published Videos
          </button>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approval {stats.pendingCount > 0 && <span className="badge">{stats.pendingCount}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback
          </button>
        </div>

        {activeTab === 'videos' && (
          <div className="admin-content">
            <div className="video-table-container">
              <table className="video-table">
                <thead>
                  <tr>
                    <th>Video</th>
                    <th>Category</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(video => (
                    <tr key={video.id}>
                      <td>
                        <div className="video-cell">
                          <img src={video.thumbnail_url || 'https://images.pexels.com/videos/3614522/pexels-photo-3614522.jpeg?auto=compress&cs=tinysrgb&w=200'} alt={video.title} />
                          <span>{video.title}</span>
                        </div>
                      </td>
                      <td>{video.category?.name || '-'}</td>
                      <td>{video.views.toLocaleString()}</td>
                      <td><span className="status-badge published">Published</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="delete-btn" onClick={() => handleDelete(video.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="admin-content">
            {pendingVideos.length === 0 ? (
              <div className="empty-state">
                <Check size={48} />
                <p>No pending videos</p>
              </div>
            ) : (
              <div className="video-table-container">
                <table className="video-table">
                  <thead>
                    <tr>
                      <th>Video</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVideos.map(video => (
                      <tr key={video.id}>
                        <td>
                          <div className="video-cell">
                            <img src={video.thumbnail_url || 'https://images.pexels.com/videos/3614522/pexels-photo-3614522.jpeg?auto=compress&cs=tinysrgb&w=200'} alt={video.title} />
                            <span>{video.title}</span>
                          </div>
                        </td>
                        <td>{video.category?.name || '-'}</td>
                        <td>
                          <div className="action-btns">
                            <button className="approve-btn" onClick={() => handleApprove(video.id)}>
                              <Check size={16} />
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(video.id)}>
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="admin-content">
            <div className="feedback-list">
              {feedback.map(fb => (
                <div key={fb.id} className="feedback-card">
                  <div className="feedback-header">
                    <span className="feedback-name">{fb.name}</span>
                    <span className="feedback-date">{new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="feedback-email">{fb.email}</div>
                  {fb.city && <div className="feedback-city">{fb.city}</div>}
                  <div className="feedback-remarks">{fb.remarks}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
