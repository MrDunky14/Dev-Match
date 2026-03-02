import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/discover', label: 'Discover', icon: '🔍' },
    { path: '/projects', label: 'Projects', icon: '🚀' },
    { path: '/create-profile', label: 'Join', icon: '✨' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">⚡</span>
                    <span className="brand-text">Dev<span className="brand-accent">Match</span></span>
                </Link>

                <div className="navbar-links">
                    {NAV_ITEMS.map(({ path, label, icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{icon}</span>
                            <span className="nav-label">{label}</span>
                        </Link>
                    ))}
                </div>

                <Link to="/post-project" className="btn btn-primary nav-cta">
                    Post Project
                </Link>
            </div>
        </nav>
    );
}
