import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, User } from 'lucide-react';
import SkillTag from './SkillTag';
import './ProfileCard.css';

export default function ProfileCard({ user }) {
    const navigate = useNavigate();
    const avatarUrl = user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

    return (
        <motion.div
            className="profile-card glass-card"
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="profile-card-header">
                <div className="profile-avatar-wrapper">
                    <img src={avatarUrl} alt={user.name} className="profile-avatar" />
                    <span className="profile-semester">Sem {user.semester}</span>
                </div>
                <div className="profile-info">
                    <h3 className="profile-name">{user.name}</h3>
                    <span className="profile-dept">{user.department}</span>
                    {user.availability && (
                        <span className={`card-availability ${user.availability === 'Looking for team' ? 'avail-green' : user.availability === 'Open to collaborate' ? 'avail-blue' : user.availability === 'Busy with project' ? 'avail-yellow' : 'avail-red'}`}>
                            {user.availability}
                        </span>
                    )}
                </div>
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
