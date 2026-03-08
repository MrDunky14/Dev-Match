import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import { useToast } from '../components/Toast';
import './NoticeBoard.css';

const TAG_LABELS = {
    all: '📋 All',
    hackathon: '🏆 Hackathon',
    workshop: '📚 Workshop',
    'team-needed': '🤝 Team Needed',
    resource: '🔗 Resource',
    general: '📢 General',
};

const TAG_COLORS = {
    hackathon: '#f59e0b',
    workshop: '#3b82f6',
    'team-needed': '#10b981',
    resource: '#8b5cf6',
    general: '#6b7280',
};

export default function NoticeBoard() {
    const { currentUser } = useIdentity();
    const toast = useToast();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState('all');

    // New post form
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', tag: 'general' });
    const [posting, setPosting] = useState(false);

    const fetchData = async (tag) => {
        setLoading(true);
        try {
            const res = await getAnnouncements(tag === 'all' ? null : tag);
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(activeTag); }, [activeTag]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content || !currentUser) return;
        setPosting(true);
        try {
            await createAnnouncement({ ...form, author_id: currentUser.id });
            setForm({ title: '', content: '', tag: 'general' });
            setShowForm(false);
            fetchData(activeTag);
            toast.success('Announcement posted!');
        } catch (err) {
            toast.error('Failed to post announcement');
        } finally {
            setPosting(false);
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <div className="notice-header-row">
                        <div>
                            <h1>📌 Notice Board</h1>
                            <p>Hackathons, workshops, team calls, and campus updates</p>
                        </div>
                        {currentUser && (
                            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                                {showForm ? '✕ Cancel' : '+ Post Notice'}
                            </button>
                        )}
                    </div>
                </div>

                {/* New post form */}
                {showForm && currentUser && (
                    <form className="post-form glass-card slide-up" onSubmit={handlePost}>
                        <p className="message-hint">Posting as <strong>{currentUser.name}</strong></p>
                        <div className="form-group">
                            <label>Title</label>
                            <input className="form-input" placeholder="e.g. HackSLRTCE 2026 Registration Open!" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Content</label>
                            <textarea className="form-textarea" placeholder="Details about the event, workshop, or team requirement..." rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select className="form-select" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                                {Object.entries(TAG_LABELS).filter(([k]) => k !== 'all').map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={posting}>
                            {posting ? 'Posting…' : 'Post Notice 📌'}
                        </button>
                    </form>
                )}

                {/* Tag filter */}
                <div className="tag-filters">
                    {Object.entries(TAG_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            className={`tag-filter-btn ${activeTag === key ? 'active' : ''}`}
                            onClick={() => setActiveTag(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Announcements */}
                {loading ? (
                    <div className="notice-grid">
                        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <h3>No announcements yet</h3>
                        <p>Be the first to post a notice!</p>
                    </div>
                ) : (
                    <div className="notice-grid stagger-children">
                        {announcements.map((ann) => (
                            <div key={ann.id} className="notice-card glass-card">
                                <div className="notice-top">
                                    <span className="notice-tag" style={{ backgroundColor: `${TAG_COLORS[ann.tag]}20`, color: TAG_COLORS[ann.tag], borderColor: `${TAG_COLORS[ann.tag]}40` }}>
                                        {TAG_LABELS[ann.tag] || ann.tag}
                                    </span>
                                    <span className="notice-time">{timeAgo(ann.created_at)}</span>
                                </div>
                                <h3 className="notice-title">{ann.title}</h3>
                                <p className="notice-content">{ann.content}</p>
                                <div className="notice-author">
                                    <img src={ann.author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ann.author.name}`} alt="" className="notice-avatar" />
                                    <span>{ann.author.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
