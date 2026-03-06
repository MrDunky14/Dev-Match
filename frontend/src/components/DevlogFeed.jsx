import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDevlogs, createDevlog, toggleReaction } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import './DevlogFeed.css';

const REACTION_EMOJIS = ['🔥', '👏', '🚀'];

export default function DevlogFeed() {
    const navigate = useNavigate();
    const { currentUser } = useIdentity();
    const [devlogs, setDevlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Post new devlog state
    const [isPosting, setIsPosting] = useState(false);
    const [newContent, setNewContent] = useState('');

    const fetchDevlogs = () => {
        getDevlogs(20)
            .then(res => setDevlogs(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDevlogs();
    }, []);

    const handlePost = async () => {
        if (!currentUser || !newContent.trim()) return;
        setIsPosting(true);
        try {
            await createDevlog({
                author_id: currentUser.id,
                content: newContent.trim()
            });
            setNewContent('');
            fetchDevlogs(); // Refresh feed
        } catch (err) {
            console.error("Failed to post devlog", err);
        } finally {
            setIsPosting(false);
        }
    };

    const handleReact = async (devlogId, emoji) => {
        if (!currentUser) return;
        try {
            await toggleReaction(devlogId, { user_id: currentUser.id, emoji });
            fetchDevlogs(); // Refresh to show updated counts
        } catch (err) {
            console.error("Failed to react", err);
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const getReactionCount = (log, emoji) => {
        const rc = log.reaction_counts?.find(r => r.emoji === emoji);
        return rc ? rc.count : 0;
    };

    return (
        <div className="devlog-feed">
            <div className="feed-header">
                <h2 className="feed-title">⚡ Live Campus Feed</h2>
                <div className="pulse-indicator"></div>
            </div>

            {currentUser && (
                <div className="devlog-post-card glass-card fade-in">
                    <img
                        src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                        alt={currentUser.name}
                        className="post-avatar"
                    />
                    <div className="post-input-wrapper">
                        <textarea
                            className="post-textarea"
                            placeholder="What are you building right now? Share a quick devlog..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows={2}
                            maxLength={300}
                        />
                        <div className="post-actions">
                            <span className="char-count">{newContent.length}/300</span>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handlePost}
                                disabled={isPosting || !newContent.trim()}
                            >
                                {isPosting ? 'Posting...' : 'Post 🚀'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="feed-list stagger-children">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 16 }}></div>
                    ))
                ) : devlogs.length === 0 ? (
                    <div className="empty-state glass-card">
                        <p>No devlogs yet. Be the first to share what you're building!</p>
                    </div>
                ) : (
                    devlogs.map(log => (
                        <div key={log.id} className="devlog-card glass-card">
                            <div className="devlog-header">
                                <img
                                    src={log.author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${log.author.name}`}
                                    alt={log.author.name}
                                    className="devlog-avatar"
                                    onClick={() => navigate(`/profile/${log.author_id}`)}
                                />
                                <div className="devlog-meta">
                                    <div className="devlog-author-row">
                                        <span
                                            className="devlog-author"
                                            onClick={() => navigate(`/profile/${log.author_id}`)}
                                        >
                                            {log.author.name}
                                        </span>
                                        <span className="devlog-time">• {formatTime(log.created_at)}</span>
                                    </div>
                                    {log.project && (
                                        <span
                                            className="devlog-project"
                                            onClick={() => navigate('/projects')}
                                        >
                                            working on <span className="project-highlight">{log.project.title}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="devlog-content">
                                {log.content}
                            </div>
                            <div className="devlog-reactions">
                                {REACTION_EMOJIS.map(emoji => {
                                    const count = getReactionCount(log, emoji);
                                    return (
                                        <button
                                            key={emoji}
                                            className={`reaction-btn ${count > 0 ? 'has-reactions' : ''}`}
                                            onClick={() => handleReact(log.id, emoji)}
                                            title={currentUser ? 'Click to react' : 'Create a profile to react'}
                                            disabled={!currentUser}
                                        >
                                            <span className="reaction-emoji">{emoji}</span>
                                            {count > 0 && <span className="reaction-count">{count}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
