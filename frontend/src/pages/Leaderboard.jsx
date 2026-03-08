import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, BadgeCheck } from 'lucide-react';
import { getLeaderboard } from '../api';
import SkillTag from '../components/SkillTag';
import './Leaderboard.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
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

export default function Leaderboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard()
            .then(res => setUsers(res.data))
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
                    <h1 className="glowing-text"><Trophy size={32} className="title-icon offset-icon" /> Campus Dev Leaderboard</h1>
                    <p>Ranked by real activity — projects, devlogs, skills, and GitHub contributions.</p>
                </div>

                {loading ? (
                    <div className="leaderboard-list">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12, marginBottom: 12 }} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="leaderboard-list"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {users.map((user, index) => (
                            <motion.div
                                key={user.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
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
                                    <h3 className="lb-name flex items-center gap-1">
                                        {user.name}
                                        {user.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500" title="Verified Student" />}
                                    </h3>
                                    <span className="lb-dept">{user.department} • Sem {user.semester}</span>
                                    {user.rank_title && <span className={`rank-title rank-${user.rank_title.toLowerCase()}`}>{user.rank_title}</span>}
                                </div>

                                <div className="lb-skills">
                                    {user.skills.slice(0, 3).map((s) => (
                                        <SkillTag key={s} skill={s} />
                                    ))}
                                    {user.skills.length > 3 && (
                                        <span className="lb-more-skills">+{user.skills.length - 3}</span>
                                    )}
                                </div>

                                <div className="lb-score-col">
                                    <div className="lb-score">
                                        <span className="score-value">{user.xp}</span>
                                        <span className="score-label">XP</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
