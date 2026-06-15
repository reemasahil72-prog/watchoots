import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Upload, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export function Header() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">STREAM</span>
          <span className="logo-accent">FLIX</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/category/movies" className="nav-link" onClick={() => setIsMenuOpen(false)}>Movies</Link>
          <Link to="/category/web-series" className="nav-link" onClick={() => setIsMenuOpen(false)}>Web Series</Link>
          <Link to="/category/music" className="nav-link" onClick={() => setIsMenuOpen(false)}>Music</Link>
          <Link to="/category/sports" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sports</Link>
          <Link to="/category/lifestyle" className="nav-link" onClick={() => setIsMenuOpen(false)}>Lifestyle</Link>
          {user && <Link to="/category/adult" className="nav-link nav-link-adult" onClick={() => setIsMenuOpen(false)}>18+</Link>}
        </nav>

        <div className="header-actions">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>

          {user ? (
            <div className="user-menu">
              <button className="user-menu-trigger">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="user-avatar" />
                ) : (
                  <User size={24} />
                )}
              </button>
              <div className="user-dropdown">
                <div className="user-info">
                  <span className="user-name">{profile?.full_name || 'User'}</span>
                  <span className="user-email">{profile?.email}</span>
                </div>
                <div className="dropdown-divider" />
                {isAdmin && (
                  <>
                    <Link to="/admin" className="dropdown-link">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/upload" className="dropdown-link">
                      <Upload size={18} /> Upload Video
                    </Link>
                  </>
                )}
                <button onClick={signOut} className="dropdown-link dropdown-link-logout">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <User size={18} />
              <span>Sign In</span>
            </Link>
          )}

          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
