import { Link } from 'react-router-dom';
import { Mail, MapPin, Globe, ExternalLink } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-text">STREAM</span>
              <span className="logo-accent">FLIX</span>
            </Link>
            <p className="footer-tagline">Your ultimate destination for movies, series, music, and more.</p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><Globe size={20} /></a>
              <a href="#" className="social-link" aria-label="Twitter"><ExternalLink size={20} /></a>
              <a href="#" className="social-link" aria-label="Instagram"><Globe size={20} /></a>
              <a href="#" className="social-link" aria-label="YouTube"><Globe size={20} /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/category/movies">Movies</Link></li>
              <li><Link to="/category/web-series">Web Series</Link></li>
              <li><Link to="/category/music">Music</Link></li>
              <li><Link to="/category/sports">Sports</Link></li>
              <li><Link to="/category/lifestyle">Lifestyle</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Genres</h4>
            <ul>
              <li><Link to="/genre/action">Action</Link></li>
              <li><Link to="/genre/comedy">Comedy</Link></li>
              <li><Link to="/genre/sci-fi">Sci-Fi</Link></li>
              <li><Link to="/genre/drama">Drama</Link></li>
              <li><Link to="/genre/romance">Romance</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="contact-list">
              <li><Mail size={16} /> contact@streamflix.com</li>
              <li><MapPin size={16} /> Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StreamFlix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
