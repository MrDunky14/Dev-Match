import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, sendMessage, getConversation, fetchGitHubProfile } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import SkillTag from '../components/SkillTag';
import './ProfileDetail.css';

const AVAILABILITY_MAP = {
    'Looking for team': { emoji: '🟢', color: '#10b981' },
    'Open to collaborate': { emoji: '🔵', color: '#3b82f6' },
    'Busy with project': { emoji: '🟡', color: '#f59e0b' },
    'Not available': { emoji: '🔴', color: '#ef4444' },
};

export default function ProfileDetail() {
    const { id } = useParams();
    const { currentUser } = useIdentity();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // GitHub repos state
    const [ghData, setGhData] = useState(null);
    const [ghLoading, setGhLoading] = useState(false);

    // Message state
    const [msgText, setMsgText] = useState('');
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const isOwnProfile = currentUser && parseInt(id) === currentUser.id;

    useEffect(() => {
        setLoading(true);
        getUser(id)
            .then((r) => {
                setUser(r.data);
                if (r.data.github_username) {
                    setGhLoading(true);
                    fetchGitHubProfile(r.data.github_username)
                        .then((gh) => setGhData(gh.data))
                        .catch(() => setGhData(null))
                        .finally(() => setGhLoading(false));
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [id]);

    // Load conversation
    useEffect(() => {
        if (currentUser && id && !isOwnProfile) {
            getConversation(currentUser.id, id)
                .then((r) => setMessages(r.data))
                .catch(() => setMessages([]));
        }
    }, [currentUser, id, sent, isOwnProfile]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!currentUser || !msgText.trim()) return;
        setSending(true);
        try {
            await sendMessage({
                sender_id: currentUser.id,
                receiver_id: parseInt(id),
                content: msgText.trim(),
            });
            setMsgText('');
            setSent((prev) => !prev);
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <span className="empty-icon">😕</span>
                        <h3>User not found</h3>
                    </div>
                </div>
            </div>
        );
    }

    const avail = AVAILABILITY_MAP[user.availability] || AVAILABILITY_MAP['Looking for team'];

    // Skill match
    const mySkills = currentUser?.skills?.map(s => s.skill_name) || [];
    const theirSkills = user.skills.map(s => s.skill_name);
    const commonSkills = mySkills.filter(s => theirSkills.includes(s));

    return (
        <div className="page">
            <div className="container">
                <div className="profile-detail-layout">
                    {/* Profile Info */}
                    <div className="profile-main glass-card slide-up">
                        <div className="profile-hero">
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="profile-avatar-lg"
                            />
                            <div className="profile-identity">
                                <h1>{user.name}</h1>
                                <span className="profile-dept">{user.department}</span>
                                <span className="profile-sem">Semester {user.semester}</span>
                                <span className="availability-badge" style={{ color: avail.color, borderColor: avail.color }}>
                                    {avail.emoji} {user.availability}
                                </span>
                            </div>
                        </div>

                        {/* Skill Match */}
                        {!isOwnProfile && currentUser && commonSkills.length > 0 && (
                            <div className="skill-match-banner">
                                🎯 <strong>{commonSkills.length} skill{commonSkills.length > 1 ? 's' : ''} in common:</strong> {commonSkills.join(', ')}
                            </div>
                        )}

                        {user.bio && (
                            <div className="profile-bio-section">
                                <h3>About</h3>
                                <p>{user.bio}</p>
                            </div>
                        )}

                        <div className="profile-skills-section">
                            <h3>Skills</h3>
                            <div className="profile-skills-grid">
                                {user.skills.map((s) => (
                                    <SkillTag key={s.id} skill={s.skill_name} />
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="profile-actions">
                            {user.whatsapp_number && (
                                <a
                                    href={`https://wa.me/91${user.whatsapp_number}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-whatsapp"
                                >
                                    💬 Chat on WhatsApp
                                </a>
                            )}
                            {user.github_url && (
                                <a
                                    href={user.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-secondary github-link"
                                >
                                    🔗 GitHub Profile
                                </a>
                            )}
                        </div>

                        {/* GitHub Section */}
                        {user.github_username && (
                            <div className="github-repos-section">
                                <h3>📂 GitHub Activity</h3>
                                {ghLoading ? (
                                    <p className="text-muted">Loading GitHub data…</p>
                                ) : ghData ? (
                                    <>
                                        {/* Latest Commit */}
                                        {ghData.latest_commit && (
                                            <div className="latest-commit">
                                                <span className="commit-label">Latest commit:</span>
                                                <span className="commit-msg">{ghData.latest_commit}</span>
                                            </div>
                                        )}

                                        {/* Language Breakdown */}
                                        {ghData.language_breakdown?.length > 0 && (
                                            <div className="lang-breakdown">
                                                <h4>Languages</h4>
                                                <div className="lang-bars">
                                                    {ghData.language_breakdown.map(lb => (
                                                        <div key={lb.language} className="lang-bar-row">
                                                            <span className="lang-name">{lb.language}</span>
                                                            <div className="lang-bar-track">
                                                                <div
                                                                    className="lang-bar-fill"
                                                                    style={{ width: `${lb.percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="lang-pct">{lb.percentage}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Repos */}
                                        {ghData.repos?.length > 0 ? (
                                            <div className="repos-grid">
                                                {ghData.repos.map((repo) => (
                                                    <a
                                                        key={repo.name}
                                                        href={repo.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="repo-card"
                                                    >
                                                        <div className="repo-header">
                                                            <span className="repo-name">{repo.name}</span>
                                                            {repo.stars > 0 && <span className="repo-stars">⭐ {repo.stars}</span>}
                                                        </div>
                                                        {repo.description && <p className="repo-desc">{repo.description}</p>}
                                                        {repo.language && <span className="repo-lang">{repo.language}</span>}
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">No public repos found</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted">Could not load GitHub data</p>
                                )}
                            </div>
                        )}

                        <div className="profile-meta">
                            <span>📧 {user.email}</span>
                            <span>📅 Joined {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Message Panel or Own Profile */}
                    <div className="message-panel glass-card slide-up">
                        {isOwnProfile ? (
                            <>
                                <h2>👋 This is your profile</h2>
                                <p className="message-hint">This is how other SLRTCE students see you. Looking good!</p>
                            </>
                        ) : !currentUser ? (
                            <>
                                <h2>💬 Want to connect?</h2>
                                <p className="message-hint">
                                    <Link to="/create-profile" className="text-link">Create a profile</Link> to message {user.name.split(' ')[0]}
                                </p>
                            </>
                        ) : (
                            <>
                                <h2>💬 Message {user.name.split(' ')[0]}</h2>
                                <p className="message-hint">
                                    Sending as <strong>{currentUser.name}</strong>
                                </p>

                                <form className="message-form" onSubmit={handleSend}>
                                    <div className="form-group">
                                        <textarea
                                            className="form-textarea"
                                            placeholder={`Hi ${user.name.split(' ')[0]}, I'd love to collaborate on...`}
                                            value={msgText}
                                            onChange={(e) => setMsgText(e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg send-btn"
                                        disabled={sending || !msgText.trim()}
                                    >
                                        {sending ? 'Sending…' : 'Send Message 📨'}
                                    </button>
                                </form>

                                {/* Conversation Thread */}
                                {messages.length > 0 && (
                                    <div className="conversation">
                                        <h3>Conversation</h3>
                                        <div className="msg-list">
                                            {messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`msg-bubble ${msg.sender_id === currentUser.id ? 'msg-sent' : 'msg-received'}`}
                                                >
                                                    <span className="msg-sender">{msg.sender.name}</span>
                                                    <p className="msg-text">{msg.content}</p>
                                                    <span className="msg-time">{formatTime(msg.created_at)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
