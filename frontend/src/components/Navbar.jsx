import { Link, useLocation } from 'react-router-dom';
import { useIdentity } from '../hooks/useIdentity';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Rocket, Pin, Trophy, Wrench, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/projects', label: 'Projects', icon: Rocket },
    { path: '/notices', label: 'Notices', icon: Pin },
    { path: '/leaderboard', label: 'Rankings', icon: Trophy },
    { path: '/toolkit', label: 'Toolkit', icon: Wrench },
];

// Mobile bottom nav only shows 5 items to avoid overflow
const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 5);

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

                {/* Desktop Nav — all items */}
                <div className="navbar-links desktop-only">
                    {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                        >
                            {location.pathname === path && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="nav-active-pill"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className="nav-icon"><Icon size={18} strokeWidth={2.5} /></span>
                            <span className="nav-label">{label}</span>
                        </Link>
                    ))}
                </div>

                {/* Mobile Bottom Nav — 5 items max */}
                <div className="navbar-links mobile-only">
                    {MOBILE_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                        >
                            {location.pathname === path && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="nav-active-pill-mobile"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className="nav-icon"><Icon size={20} strokeWidth={2.5} /></span>
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
                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className="user-dropdown glass-card"
                                        onClick={() => setShowMenu(false)}
                                    >
                                        <Link to="/dashboard" className="dropdown-item">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <Link to={`/profile/${currentUser.id}`} className="dropdown-item">
                                            <User size={16} /> My Profile
                                        </Link>
                                        <Link to="/post-project" className="dropdown-item">
                                            <Rocket size={16} /> Post Project
                                        </Link>
                                        <Link to="/toolkit" className="dropdown-item mobile-only-item">
                                            <Wrench size={16} /> Toolkit
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item dropdown-logout" onClick={logout}>
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link to="/toolkit" className="mobile-toolkit-icon mobile-only" title="Dev Toolkit">
                                <Wrench size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-primary nav-cta">
                                Login ✨
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
