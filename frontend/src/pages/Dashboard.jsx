import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Inbox, Send, Award, Activity, CheckCircle, XCircle, Search, Code2, Trophy, Users, BadgeCheck } from 'lucide-react';
import { getUserProjects, getReceivedApplications, getMyApplications, updateApplication, getLeaderboard, updateProject } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import { useToast } from '../components/Toast';
import './Dashboard.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

export default function Dashboard() {
    const navigate = useNavigate();
    const { currentUser } = useIdentity();
    const toast = useToast();
    const [myProjects, setMyProjects] = useState([]);
    const [receivedApps, setReceivedApps] = useState([]);
    const [myApps, setMyApps] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [myXp, setMyXp] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects');

    useEffect(() => {
        if (!currentUser) return;
        Promise.all([
            getUserProjects(currentUser.id).then(r => setMyProjects(r.data)).catch(() => { }),
            getReceivedApplications(currentUser.id).then(r => setReceivedApps(r.data)).catch(() => { }),
            getMyApplications(currentUser.id).then(r => setMyApps(r.data)).catch(() => { }),
            getLeaderboard().then(r => {
                const idx = r.data.findIndex(u => u.id === currentUser.id);
                if (idx !== -1) {
                    setMyRank(idx + 1);
                    setMyXp(r.data[idx].xp);
                }
            }).catch(() => { }),
        ]).finally(() => setLoading(false));
    }, [currentUser, navigate]);

    const handleAppAction = async (appId, status) => {
        try {
            await updateApplication(appId, status);
            setReceivedApps(prev => prev.map(a =>
                a.id === appId ? { ...a, status } : a
            ));
            toast.success(`Application ${status}!`);
        } catch (err) {
            toast.error('Failed to update application');
        }
    };

    const handleStatusChange = async (projectId, newStatus) => {
        try {
            await updateProject(projectId, { status: newStatus });
            setMyProjects(prev => prev.map(p =>
                p.id === projectId ? { ...p, status: newStatus } : p
            ));
            toast.success(`Project moved to ${newStatus}!`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (!currentUser) return null;

    const pendingApps = receivedApps.filter(a => a.status === 'pending');

    return (
        <div className="page">
            <div className="container">
                <div className="dash-header slide-up">
                    <div className="dash-welcome">
                        <motion.img
                            src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                            alt={currentUser.name}
                            className="dash-avatar"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                        <div>
                            <h1 className="flex items-center gap-2">
                                Hey, {currentUser.name.split(' ')[0]}!
                                {currentUser.is_verified && <BadgeCheck className="w-8 h-8 text-blue-500 mt-1" title="Verified Student" />}
                            </h1>
                            <p className="dash-subtitle">Here's your DevMatch activity at a glance.</p>
                        </div>
                    </div>

                    <div className="dash-stats">
                        <div className="stat-card glass-card">
                            <span className="stat-number">{myProjects.length}</span>
                            <span className="stat-label">Projects</span>
                        </div>
                        <div className="stat-card glass-card">
                            <span className="stat-number">{pendingApps.length}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-card glass-card">
                            <span className="stat-number">{myXp}</span>
                            <span className="stat-label">XP</span>
                        </div>
                        <div className="stat-card glass-card">
                            <span className="stat-number">#{myRank || '—'}</span>
                            <span className="stat-label">Rank</span>
                        </div>
                    </div>

                    <div className="dash-quick-actions">
                        <Link to="/discover" className="dash-quick-btn"><Search size={18} /> Find Teammates</Link>
                        <Link to="/post-project" className="dash-quick-btn"><Code2 size={18} /> Post a Project</Link>
                        <Link to="/projects" className="dash-quick-btn"><Trophy size={18} /> Browse Projects</Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="dash-tabs">
                    <button
                        className={`dash-tab ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        <Rocket size={16} /> My Projects ({myProjects.length})
                    </button>
                    <button
                        className={`dash-tab ${activeTab === 'incoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('incoming')}
                    >
                        <Inbox size={16} /> Incoming Apps {pendingApps.length > 0 && <span className="tab-badge">{pendingApps.length}</span>}
                    </button>
                    <button
                        className={`dash-tab ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        <Send size={16} /> My Applications ({myApps.length})
                    </button>
                    <button
                        className={`dash-tab ${activeTab === 'teams' ? 'active' : ''}`}
                        onClick={() => setActiveTab('teams')}
                    >
                        <Users size={16} /> My Teams
                    </button>
                </div>

                {loading ? (
                    <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            className="dash-content"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
                        >
                            {/* My Projects */}
                            {activeTab === 'projects' && (
                                <>
                                    {myProjects.length === 0 ? (
                                        <motion.div variants={itemVariants} className="empty-state glass-card">
                                            <Rocket size={40} className="empty-icon" style={{ color: 'var(--text-muted)' }} />
                                            <h3>No projects yet</h3>
                                            <p>Post your first project and find teammates!</p>
                                            <Link to="/post-project" className="btn btn-primary">Post a Project</Link>
                                        </motion.div>
                                    ) : myProjects.map(p => (
                                        <motion.div variants={itemVariants} key={p.id} className="dash-item glass-card">
                                            <div className="dash-item-main">
                                                <h3>{p.title}</h3>
                                                <p className="dash-item-desc">{p.description.slice(0, 100)}...</p>
                                                <div className="dash-item-meta">
                                                    <span className={`status-badge ${p.status}`}>
                                                        {p.status === 'open' ? <CheckCircle size={14} className="badge-icon-left" /> : <XCircle size={14} className="badge-icon-left" />}
                                                        {p.status}
                                                    </span>
                                                    <span className="meta-text">{p.skills_needed}</span>
                                                </div>
                                                <div className="dash-status-actions">
                                                    {p.status === 'open' && (
                                                        <button className="btn btn-sm btn-ghost" onClick={() => handleStatusChange(p.id, 'in_progress')}>
                                                            Mark In Progress
                                                        </button>
                                                    )}
                                                    {p.status === 'in_progress' && (
                                                        <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(p.id, 'showcase')}>
                                                            🎉 Move to Showcase
                                                        </button>
                                                    )}
                                                    {p.status === 'showcase' && (
                                                        <span className="showcase-label">✨ Showcased</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            )}

                            {/* Incoming Applications */}
                            {activeTab === 'incoming' && (
                                <>
                                    {receivedApps.length === 0 ? (
                                        <motion.div variants={itemVariants} className="empty-state glass-card">
                                            <Inbox size={40} className="empty-icon" style={{ color: 'var(--text-muted)' }} />
                                            <h3>No applications received yet</h3>
                                            <p>Post projects to start receiving applications!</p>
                                        </motion.div>
                                    ) : receivedApps.map(app => (
                                        <motion.div variants={itemVariants} key={app.id} className="dash-item glass-card dash-item-row-layout">
                                            <div className="dash-item-main">
                                                <div className="app-header">
                                                    <img
                                                        src={app.applicant.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.applicant.name}`}
                                                        className="app-avatar"
                                                        alt={app.applicant.name}
                                                    />
                                                    <div>
                                                        <h3
                                                            className="app-name clickable"
                                                            onClick={() => navigate(`/profile/${app.applicant.id}`)}
                                                        >{app.applicant.name}</h3>
                                                        <p className="meta-text">Applied to <strong>{app.project.title}</strong></p>
                                                    </div>
                                                </div>
                                                {app.message && <p className="app-message">"{app.message}"</p>}
                                            </div>
                                            <div className="app-actions">
                                                {app.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            className="btn btn-accept"
                                                            onClick={() => handleAppAction(app.id, 'accepted')}
                                                        ><CheckCircle size={16} /> Accept</button>
                                                        <button
                                                            className="btn btn-reject"
                                                            onClick={() => handleAppAction(app.id, 'rejected')}
                                                        ><XCircle size={16} /> Reject</button>
                                                    </>
                                                ) : (
                                                    <span className={`status-badge ${app.status}`}>{app.status}</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            )}

                            {/* My Applications */}
                            {activeTab === 'sent' && (
                                <>
                                    {myApps.length === 0 ? (
                                        <motion.div variants={itemVariants} className="empty-state glass-card">
                                            <Send size={40} className="empty-icon" style={{ color: 'var(--text-muted)' }} />
                                            <h3>You haven't applied to any projects yet</h3>
                                            <Link to="/projects" className="btn btn-primary">Browse Projects</Link>
                                        </motion.div>
                                    ) : myApps.map(app => (
                                        <motion.div variants={itemVariants} key={app.id} className="dash-item glass-card">
                                            <div className="dash-item-main">
                                                <h3>{app.project.title}</h3>
                                                {app.message && <p className="app-message">"{app.message}"</p>}
                                                <span className={`status-badge ${app.status}`}>{app.status}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            )}

                            {/* My Teams */}
                            {activeTab === 'teams' && (() => {
                                const acceptedApps = receivedApps.filter(a => a.status === 'accepted');
                                const teamsByProject = {};
                                acceptedApps.forEach(a => {
                                    if (!teamsByProject[a.project.id]) {
                                        teamsByProject[a.project.id] = { title: a.project.title, members: [] };
                                    }
                                    teamsByProject[a.project.id].members.push(a.applicant);
                                });
                                const projectIds = Object.keys(teamsByProject);
                                return projectIds.length === 0 ? (
                                    <motion.div variants={itemVariants} className="empty-state glass-card">
                                        <Users size={40} className="empty-icon" style={{ color: 'var(--text-muted)' }} />
                                        <h3>No team formed yet</h3>
                                        <p>Accept applications to build your team!</p>
                                    </motion.div>
                                ) : projectIds.map(pid => (
                                    <motion.div variants={itemVariants} key={pid} className="dash-item glass-card team-card">
                                        <h3>{teamsByProject[pid].title}</h3>
                                        <div className="team-members">
                                            {/* Owner */}
                                            <div className="team-member team-owner" onClick={() => navigate(`/profile/${currentUser.id}`)}>
                                                <img src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt={currentUser.name} className="team-avatar" />
                                                <div>
                                                    <span className="team-member-name">{currentUser.name}</span>
                                                    <span className="team-role">Owner</span>
                                                </div>
                                            </div>
                                            {teamsByProject[pid].members.map(m => (
                                                <div key={m.id} className="team-member" onClick={() => navigate(`/profile/${m.id}`)}>
                                                    <img src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt={m.name} className="team-avatar" />
                                                    <div>
                                                        <span className="team-member-name">{m.name}</span>
                                                        <span className="team-role">Member</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ));
                            })()}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
