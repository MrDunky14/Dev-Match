import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIdentity } from '../hooks/useIdentity';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Rocket, Pin, Trophy, Wrench, Menu, X, LogOut, User, LayoutDashboard, Bell, Edit, Award, BadgeCheck } from 'lucide-react';
import { getNotificationCount, getNotifications, markAllNotificationsRead, markNotificationRead } from '../api';
import './Navbar.css';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/projects', label: 'Projects', icon: Rocket },
    { path: '/showcase', label: 'Showcase', icon: Award },
    { path: '/notices', label: 'Notices', icon: Pin },
    { path: '/leaderboard', label: 'Rankings', icon: Trophy },
    { path: '/toolkit', label: 'Toolkit', icon: Wrench },
];

// Mobile bottom nav only shows 5 items to avoid overflow
const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 5);

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useIdentity();
    const [showMenu, setShowMenu] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const notifRef = useRef(null);

    // Poll for notification count
    useEffect(() => {
        if (!currentUser) return;
        const fetchCount = () => {
            getNotificationCount().then(r => setUnreadCount(r.data.count)).catch(() => { });
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [currentUser]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const openNotifs = async () => {
        setShowNotifs(!showNotifs);
        setShowMenu(false);
        if (!showNotifs) {
            try {
                const r = await getNotifications();
                setNotifications(r.data);
            } catch { }
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch { }
    };

    const handleNotifClick = async (notif) => {
        if (!notif.read) {
            markNotificationRead(notif.id).catch(() => { });
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        }
        setShowNotifs(false);
        if (notif.link) navigate(notif.link);
    };

    const timeAgo = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <>
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


                    <div className="navbar-right">
                        {currentUser ? (
                            <>
                                {/* Notification Bell */}
                                <div className="notif-wrapper" ref={notifRef}>
                                    <button className="notif-trigger" onClick={openNotifs}>
                                        <Bell size={20} strokeWidth={2.5} />
                                        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                                    </button>
                                    <AnimatePresence>
                                        {showNotifs && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                className="notif-dropdown glass-card"
                                            >
                                                <div className="notif-header">
                                                    <h4>Notifications</h4>
                                                    {unreadCount > 0 && (
                                                        <button className="notif-mark-all" onClick={handleMarkAllRead}>
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="notif-list">
                                                    {notifications.length === 0 ? (
                                                        <div className="notif-empty">No notifications yet</div>
                                                    ) : notifications.slice(0, 10).map(n => (
                                                        <button
                                                            key={n.id}
                                                            className={`notif-item ${!n.read ? 'unread' : ''}`}
                                                            onClick={() => handleNotifClick(n)}
                                                        >
                                                            <img
                                                                src={n.from_user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.from_user?.name || 'user'}`}
                                                                alt=""
                                                                className="notif-avatar"
                                                            />
                                                            <div className="notif-content">
                                                                <span className="notif-text">{n.content}</span>
                                                                <span className="notif-time">{timeAgo(n.created_at)}</span>
                                                            </div>
                                                            {!n.read && <span className="notif-dot" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* User Menu */}
                                <div className="user-menu-wrapper">
                                    <button className="user-menu-trigger" onClick={() => setShowMenu(!showMenu)}>
                                        <div style={{ position: 'relative', display: 'flex' }}>
                                            <img
                                                src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                                                alt={currentUser.name}
                                                className="nav-user-avatar"
                                            />
                                            {currentUser.is_verified && <BadgeCheck className="verified-avatar-badge" style={{ bottom: '-4px', right: '-4px', width: '1rem', height: '1rem', boxShadow: '0 0 0 2px rgba(11, 15, 25, 0.95)' }} />}
                                        </div>
                                        <span className="nav-user-name flex items-center gap-1">
                                            {currentUser.name.split(' ')[0]}
                                        </span>
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
                                                <Link to="/edit-profile" className="dropdown-item">
                                                    <Edit size={16} /> Edit Profile
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
                            </>
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

            {/* Mobile Bottom Nav — 5 items max */}
            <div className="mobile-bottom-nav">
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
        </>
    );
}
