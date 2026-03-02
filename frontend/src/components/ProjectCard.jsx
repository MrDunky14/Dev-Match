import { useNavigate } from 'react-router-dom';
import SkillTag from './SkillTag';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
    const navigate = useNavigate();
    const skillsList = project.skills_needed ? project.skills_needed.split(',').map(s => s.trim()).filter(Boolean) : [];
    const rolesList = project.roles_needed ? project.roles_needed.split(',').map(r => r.trim()).filter(Boolean) : [];

    return (
        <div className="project-card glass-card">
            <div className="project-card-top">
                <span className={`project-status ${project.status}`}>
                    {project.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                </span>
            </div>

            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>

            {skillsList.length > 0 && (
                <div className="project-section">
                    <span className="project-section-label">Skills Needed</span>
                    <div className="project-tags">
                        {skillsList.map((skill) => (
                            <SkillTag key={skill} skill={skill} />
                        ))}
                    </div>
                </div>
            )}

            {rolesList.length > 0 && (
                <div className="project-section">
                    <span className="project-section-label">Roles</span>
                    <div className="project-roles">
                        {rolesList.map((role) => (
                            <span key={role} className="role-badge">👤 {role}</span>
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
                <button
                    className="btn btn-primary project-interest-btn"
                    onClick={() => project.owner && navigate(`/profile/${project.owner.id}`)}
                >
                    I'm Interested 🙋
                </button>
            </div>
        </div>
    );
}
