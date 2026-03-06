import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdentity } from '../hooks/useIdentity';
import { applyToProject, getApplicationCount } from '../api';
import { Users, Send, CheckCircle2, XCircle, Rocket, User } from 'lucide-react';
import SkillTag from './SkillTag';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
    const navigate = useNavigate();
    const { currentUser } = useIdentity();
    const [showApply, setShowApply] = useState(false);
    const [applyMsg, setApplyMsg] = useState('');
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [appCount, setAppCount] = useState(0);

    const skillsList = project.skills_needed ? project.skills_needed.split(',').map(s => s.trim()).filter(Boolean) : [];
    const rolesList = project.roles_needed ? project.roles_needed.split(',').map(r => r.trim()).filter(Boolean) : [];
    const isOwner = currentUser && project.owner && currentUser.id === project.owner.id;

    // Skill match
    const mySkills = currentUser?.skills?.map(s => s.skill_name) || [];
    const matchCount = skillsList.filter(s => mySkills.includes(s)).length;

    useEffect(() => {
        getApplicationCount(project.id)
            .then(r => setAppCount(r.data.count))
            .catch(() => { });
    }, [project.id, applied]);

    const handleApply = async () => {
        if (!currentUser) return;
        setApplying(true);
        try {
            await applyToProject(project.id, {
                project_id: project.id,
                applicant_id: currentUser.id,
                message: applyMsg,
            });
            setApplied(true);
            setShowApply(false);
        } catch (err) {
            console.error(err);
        } finally {
            setApplying(false);
        }
    };

    return (
        <motion.div
            className="project-card glass-card"
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="project-card-top">
                <span className={`project-status ${project.status}`}>
                    {project.status === 'open' ? <><CheckCircle2 size={14} /> Open</> : <><XCircle size={14} /> Closed</>}
                </span>
                {appCount > 0 && (
                    <span className="app-count-badge">
                        <Users size={14} /> {appCount} applicant{appCount !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>

            {/* Skill Match */}
            {currentUser && !isOwner && matchCount > 0 && (
                <div className="project-match">
                    🎯 You match {matchCount} skill{matchCount > 1 ? 's' : ''}
                </div>
            )}

            {skillsList.length > 0 && (
                <div className="project-section">
                    <span className="project-section-label">Skills Needed</span>
                    <div className="project-tags">
                        {skillsList.map((skill) => (
                            <SkillTag key={skill} skill={skill} highlight={mySkills.includes(skill)} />
                        ))}
                    </div>
                </div>
            )}

            {rolesList.length > 0 && (
                <div className="project-section">
                    <span className="project-section-label">Roles</span>
                    <div className="project-roles">
                        {rolesList.map((role) => (
                            <span key={role} className="role-badge"><User size={14} /> {role}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="project-footer">
                <div className="project-owner" onClick={() => project.owner && navigate(`/profile/${project.owner.id}`)} style={{ cursor: 'pointer' }}>
                    {project.owner && (
                        <>
                            <img
                                src={project.owner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner.name}`}
                                alt={project.owner.name}
                                className="project-owner-avatar"
                            />
                            <span className="project-owner-name">{project.owner.name}</span>
                        </>
                    )}
                </div>

                {applied ? (
                    <span className="applied-badge"><CheckCircle2 size={16} /> Applied</span>
                ) : isOwner ? (
                    <span className="owner-badge">Your Project</span>
                ) : (
                    <button
                        className="btn btn-primary project-interest-btn"
                        onClick={() => currentUser ? setShowApply(!showApply) : navigate('/create-profile')}
                    >
                        {showApply ? 'Cancel' : <><Send size={16} /> Apply</>}
                    </button>
                )}
            </div>

            {/* Inline Apply Form */}
            <AnimatePresence>
                {showApply && (
                    <motion.div
                        className="apply-form"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <textarea
                            className="form-textarea"
                            placeholder={`Why are you interested in "${project.title}"?`}
                            value={applyMsg}
                            onChange={(e) => setApplyMsg(e.target.value)}
                            rows={2}
                        />
                        <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                            {applying ? 'Sending…' : <><Rocket size={16} /> Send Application</>}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
