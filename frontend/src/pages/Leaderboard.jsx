import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../api';
import SkillTag from '../components/SkillTag';
import './Leaderboard.css';

export default function Leaderboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers()
            .then(res => {
                // Calculate gamified "Dev Score" based on skills and profile activity
                const rankedUsers = res.data.map(u => {
                    const skillScore = (u.skills?.length || 0) * 15;
                    // Boost based on profile completeness (github link adds big points)
                    const githubBoost = u.github_username ? 120 : 0;
                    // Add a tiny random factor based on id to avoid identical scores
                    const activityBoost = ((20 - u.id) * 3);
                    return {
                        ...u,
                        devScore: skillScore + githubBoost + activityBoost
                    };
                }).sort((a, b) => b.devScore - a.devScore);
                setUsers(rankedUsers);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const getRankStyle = (index) => {
        if (index === 0) return 'rank-1';
        if (index === 1) return 'rank-2';
        if (index === 2) return 'rank-3';
        return 'rank-normal';
    };

    const getRankIcon = (index) => {
        if (index === 0) return '👑';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}`;
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header leaderboard-header text-center">
                    <h1 className="glowing-text">🏆 Campus Dev Leaderboard</h1>
                    <p>The most active and skilled developers at SLRTCE.</p>
                </div>

                {loading ? (
                    <div className="leaderboard-list">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12, marginBottom: 12 }} />
                        ))}
                    </div>
                ) : (
                    <div className="leaderboard-list stagger-children">
                        {users.map((user, index) => (
                            <div
                                key={user.id}
                                className={`leaderboard-card glass-card ${getRankStyle(index)}`}
                                onClick={() => navigate(`/profile/${user.id}`)}
                            >
                                <div className="lb-rank">
                                    <span className="rank-number">{getRankIcon(index)}</span>
                                </div>
                                <img
                                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    alt={user.name}
                                    className="lb-avatar"
                                />
                                <div className="lb-info">
                                    <h3 className="lb-name">{user.name}</h3>
                                    <span className="lb-dept">{user.department} • Sem {user.semester}</span>
                                </div>

                                <div className="lb-skills">
                                    {user.skills.slice(0, 3).map((s) => (
                                        <SkillTag key={s.id} skill={s.skill_name} />
                                    ))}
                                    {user.skills.length > 3 && (
                                        <span className="lb-more-skills">+{user.skills.length - 3}</span>
                                    )}
                                </div>

                                <div className="lb-score-col">
                                    <div className="lb-score">
                                        <span className="score-value">{user.devScore}</span>
                                        <span className="score-label">XP</span>
                                    </div>
                                    <div className="score-glow"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
