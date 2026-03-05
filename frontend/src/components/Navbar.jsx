import { Link, useLocation } from 'react-router-dom';
import { useIdentity } from '../hooks/useIdentity';
import { useState } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/discover', label: 'Discover', icon: '🔍' },
    { path: '/projects', label: 'Projects', icon: '🚀' },
    { path: '/notices', label: 'Notices', icon: '📌' },
    { path: '/leaderboard', label: 'Rankings', icon: '🏆' },
];

export default function Navbar() {
    const location = useLocation();
    const { currentUser, logout } = useIdentity();
    const [showMenu, setShowMenu] = useState(false);

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

                <div className="navbar-right">
                    {currentUser ? (
                        <div className="user-menu-wrapper">
                            <button className="user-menu-trigger" onClick={() => setShowMenu(!showMenu)}>
                                <img
                                    src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                                    alt={currentUser.name}
                                    className="nav-user-avatar"
                                />
                                <span className="nav-user-name">{currentUser.name.split(' ')[0]}</span>
                            </button>
                            {showMenu && (
                                <div className="user-dropdown glass-card" onClick={() => setShowMenu(false)}>
                                    <Link to={`/profile/${currentUser.id}`} className="dropdown-item">
                                        👤 My Profile
                                    </Link>
                                    <Link to="/post-project" className="dropdown-item">
                                        🚀 Post Project
                                    </Link>
                                    <button className="dropdown-item dropdown-logout" onClick={logout}>
                                        🚪 Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/create-profile" className="btn btn-primary nav-cta">
                            Join SLRTCE ✨
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
