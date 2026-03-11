import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-icon">📍</span>
          <div className="navbar-brand-text">
            <span className="navbar-title">Smart Campus Navigation</span>
            <span className="navbar-college">St. Philomena's College, Mysuru</span>
          </div>
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Map
          </Link>
          <Link
            to="/admin"
            className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
