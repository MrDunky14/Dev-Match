import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUser, getUsers, sendMessage, getConversation } from '../api';
import SkillTag from '../components/SkillTag';
import './ProfileDetail.css';

export default function ProfileDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Message state
    const [senderId, setSenderId] = useState('');
    const [msgText, setMsgText] = useState('');
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUser(id)
            .then((r) => setUser(r.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
        getUsers().then((r) => setAllUsers(r.data.filter((u) => u.id !== parseInt(id)))).catch(() => { });
    }, [id]);

    // Load conversation when sender is selected
    useEffect(() => {
        if (senderId && id) {
            getConversation(senderId, id)
                .then((r) => setMessages(r.data))
                .catch(() => setMessages([]));
        }
    }, [senderId, id, sent]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!senderId || !msgText.trim()) return;
        setSending(true);
        try {
            await sendMessage({
                sender_id: parseInt(senderId),
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
                            </div>
                        </div>

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

                        <div className="profile-meta">
                            <span>📧 {user.email}</span>
                            <span>📅 Joined {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Message Panel */}
                    <div className="message-panel glass-card slide-up">
                        <h2>💬 Send a Message</h2>
                        <p className="message-hint">
                            Reach out to {user.name.split(' ')[0]} about a project or collaboration
                        </p>

                        <form className="message-form" onSubmit={handleSend}>
                            <div className="form-group">
                                <label>Your Identity</label>
                                <select
                                    className="form-select"
                                    value={senderId}
                                    onChange={(e) => setSenderId(e.target.value)}
                                >
                                    <option value="">Select your name</option>
                                    {allUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} — {u.department}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Message</label>
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
                                disabled={sending || !senderId || !msgText.trim()}
                            >
                                {sending ? 'Sending…' : 'Send Message 📨'}
                            </button>
                        </form>

                        {/* Conversation Thread */}
                        {senderId && messages.length > 0 && (
                            <div className="conversation">
                                <h3>Conversation</h3>
                                <div className="msg-list">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`msg-bubble ${msg.sender_id === parseInt(senderId) ? 'msg-sent' : 'msg-received'}`}
                                        >
                                            <span className="msg-sender">{msg.sender.name}</span>
                                            <p className="msg-text">{msg.content}</p>
                                            <span className="msg-time">{formatTime(msg.created_at)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
