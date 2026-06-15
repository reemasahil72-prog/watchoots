import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Check, AlertCircle } from 'lucide-react';
import './Feedback.css';

export function Feedback() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    remarks: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('feedback').insert({
        name: formData.name,
        email: formData.email,
        city: formData.city || null,
        remarks: formData.remarks,
      });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setFormData({ name: '', email: '', city: '', remarks: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="feedback-page">
      <div className="container">
        <div className="feedback-container">
          <div className="feedback-header">
            <h1>We Value Your Feedback</h1>
            <p>Help us improve your streaming experience</p>
          </div>

          {success && (
            <div className="success-banner">
              <Check size={20} />
              Thank you for your feedback!
            </div>
          )}

          {error && (
            <div className="error-banner">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  placeholder="your.email@example.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="remarks">Remarks *</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Share your thoughts, suggestions, or report any issues..."
                rows={5}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send size={20} />
                  Send Feedback
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
