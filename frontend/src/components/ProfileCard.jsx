import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, User, Zap, BadgeCheck } from 'lucide-react';
import SkillTag from './SkillTag';
import './ProfileCard.css';

export default function ProfileCard({ user, currentUser }) {
    const navigate = useNavigate();
    const avatarUrl = user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

    // Quick client-side match score
    const mySkills = currentUser?.skills?.map(s => s.skill_name) || [];
    const theirSkills = user.skills?.map(s => s.skill_name) || [];
    const shared = mySkills.filter(s => theirSkills.includes(s)).length;
    const complementary = theirSkills.filter(s => !mySkills.includes(s)).length;
    const matchScore = currentUser && currentUser.id !== user.id && (mySkills.length + theirSkills.length) > 0
        ? Math.min(100, Math.round((shared * 15 + complementary * 10) / 1.0))
        : null;

    return (
        <motion.div
            className="profile-card glass-card"
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="profile-card-header">
                <div className="profile-avatar-wrapper" style={{ position: 'relative', display: 'flex' }}>
                    <img src={avatarUrl} alt={user.name} className="profile-avatar" />
                    {user.is_verified && <BadgeCheck className="verified-avatar-badge" title="Verified Student" style={{ bottom: '-4px', right: '-4px', boxShadow: '0 0 0 2px var(--bg-card)' }} />}
                </div>
                <div className="profile-info">
                    <h3 className="profile-name flex items-center">
                        {user.name}
                    </h3>
                    <span className="profile-dept">Sem {user.semester} &bull; {user.department}</span>
                    {user.availability && (
                        <span className={`card-availability ${user.availability === 'Looking for team' ? 'avail-green' : user.availability === 'Open to collaborate' ? 'avail-blue' : user.availability === 'Busy with project' ? 'avail-yellow' : 'avail-red'}`}>
                            {user.availability}
                        </span>
                    )}
                </div>
                {matchScore !== null && matchScore > 0 && (
                    <span className="card-match-badge" title="Compatibility score">
                        <Zap size={12} /> {matchScore}%
                    </span>
                )}
            </div>

            <p className="profile-bio">{user.bio}</p>

            <div className="profile-skills">
                {user.skills?.map((s) => (
                    <SkillTag key={s.id || s.skill_name} skill={s.skill_name} />
                ))}
            </div>

            <div className="profile-footer">
                {user.github_url && (
                    <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="github-link">
                        <Github size={18} />
                        GitHub
                    </a>
                )}
                <button className="btn btn-secondary profile-connect-btn" onClick={() => navigate(`/profile/${user.id}`)}>
                    <User size={16} /> View Profile
                </button>
            </div>
        </motion.div>
    );
}
