import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProjects, getReceivedApplications, getMyApplications, updateApplication, getLeaderboard } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { currentUser } = useIdentity();
    const [myProjects, setMyProjects] = useState([]);
    const [receivedApps, setReceivedApps] = useState([]);
    const [myApps, setMyApps] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [myXp, setMyXp] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
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
        } catch (err) {
            console.error("Failed to update application", err);
        }
    };

    if (!currentUser) return null;

    const pendingApps = receivedApps.filter(a => a.status === 'pending');

    return (
        <div className="page">
            <div className="container">
                <div className="dash-header slide-up">
                    <div className="dash-welcome">
                        <img
                            src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                            alt={currentUser.name}
                            className="dash-avatar"
                        />
                        <div>
                            <h1>Hey, {currentUser.name.split(' ')[0]}! 👋</h1>
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
                </div>

                {/* Tabs */}
                <div className="dash-tabs">
                    <button
                        className={`dash-tab ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >🚀 My Projects ({myProjects.length})</button>
                    <button
                        className={`dash-tab ${activeTab === 'incoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('incoming')}
                    >📥 Incoming Apps {pendingApps.length > 0 && <span className="tab-badge">{pendingApps.length}</span>}</button>
                    <button
                        className={`dash-tab ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >📤 My Applications ({myApps.length})</button>
                </div>

                {loading ? (
                    <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                ) : (
                    <div className="dash-content stagger-children">
                        {/* My Projects */}
                        {activeTab === 'projects' && (
                            <>
                                {myProjects.length === 0 ? (
                                    <div className="empty-state glass-card">
                                        <span className="empty-icon">🚀</span>
                                        <h3>No projects yet</h3>
                                        <p>Post your first project and find teammates!</p>
                                        <Link to="/post-project" className="btn btn-primary">Post a Project</Link>
                                    </div>
                                ) : myProjects.map(p => (
                                    <div key={p.id} className="dash-item glass-card">
                                        <div className="dash-item-main">
                                            <h3>{p.title}</h3>
                                            <p className="dash-item-desc">{p.description.slice(0, 100)}...</p>
                                            <div className="dash-item-meta">
                                                <span className={`status-badge ${p.status}`}>{p.status}</span>
                                                <span className="meta-text">{p.skills_needed}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Incoming Applications */}
                        {activeTab === 'incoming' && (
                            <>
                                {receivedApps.length === 0 ? (
                                    <div className="empty-state glass-card">
                                        <span className="empty-icon">📥</span>
                                        <h3>No applications received yet</h3>
                                        <p>Post projects to start receiving applications!</p>
                                    </div>
                                ) : receivedApps.map(app => (
                                    <div key={app.id} className="dash-item glass-card">
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
                                            <div className="app-actions">
                                                {app.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            className="btn btn-accept"
                                                            onClick={() => handleAppAction(app.id, 'accepted')}
                                                        >✅ Accept</button>
                                                        <button
                                                            className="btn btn-reject"
                                                            onClick={() => handleAppAction(app.id, 'rejected')}
                                                        >❌ Reject</button>
                                                    </>
                                                ) : (
                                                    <span className={`status-badge ${app.status}`}>{app.status}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* My Applications */}
                        {activeTab === 'sent' && (
                            <>
                                {myApps.length === 0 ? (
                                    <div className="empty-state glass-card">
                                        <span className="empty-icon">📤</span>
                                        <h3>You haven't applied to any projects yet</h3>
                                        <Link to="/projects" className="btn btn-primary">Browse Projects</Link>
                                    </div>
                                ) : myApps.map(app => (
                                    <div key={app.id} className="dash-item glass-card">
                                        <div className="dash-item-main">
                                            <h3>{app.project.title}</h3>
                                            {app.message && <p className="app-message">"{app.message}"</p>}
                                            <span className={`status-badge ${app.status}`}>{app.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
