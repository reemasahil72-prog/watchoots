import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Category, SubCategory } from '../../lib/supabase';
import { Upload as UploadIcon, X, Check, Loader } from 'lucide-react';
import './Upload.css';

export function Upload() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    category_id: '',
    sub_category_id: '',
    is_age_restricted: false,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  async function fetchCategories() {
    const [catRes, subCatRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('sub_categories').select('*').order('name'),
    ]);
    setCategories((catRes.data as Category[]) || []);
    setSubCategories((subCatRes.data as SubCategory[]) || []);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user?.id)
        .single();

      const { error: insertError } = await supabase.from('videos').insert({
        title: formData.title,
        description: formData.description || null,
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url || null,
        category_id: formData.category_id || null,
        sub_category_id: formData.sub_category_id || null,
        uploader_id: profile?.id || user?.id,
        is_published: isAdmin,
        is_age_restricted: formData.is_age_restricted,
      });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        category_id: '',
        sub_category_id: '',
        is_age_restricted: false,
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error uploading video:', err);
      setError('Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="upload-page">
      <div className="container">
        <div className="upload-container">
          <div className="upload-header">
            <UploadIcon size={32} />
            <h1>Upload Video</h1>
            <p>Add new content to the platform</p>
          </div>

          {success && (
            <div className="success-banner">
              <Check size={20} />
              Video uploaded successfully!
            </div>
          )}

          {error && (
            <div className="error-banner">
              <X size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter video description"
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="video_url">Video URL *</label>
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="thumbnail_url">Thumbnail URL</label>
                <input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  placeholder="https://example.com/thumb.jpg"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sub_category_id">Genre</label>
                <select
                  id="sub_category_id"
                  name="sub_category_id"
                  value={formData.sub_category_id}
                  onChange={handleChange}
                >
                  <option value="">Select genre</option>
                  {subCategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_age_restricted"
                  checked={formData.is_age_restricted}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">18+ Age Restricted Content</span>
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon size={20} />
                  Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
