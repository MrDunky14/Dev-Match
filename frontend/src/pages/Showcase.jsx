import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Github } from 'lucide-react';
import { getProjects } from '../api';
import SkillTag from '../components/SkillTag';
import './Showcase.css';

export default function Showcase() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjects({ status: 'showcase' })
            .then(r => setProjects(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="showcase-page container">
            <div className="showcase-header">
                <Trophy size={28} className="title-icon" />
                <div>
                    <h1>Project Showcase</h1>
                    <p className="showcase-subtitle">Completed projects built by SLRTCE students</p>
                </div>
            </div>

            {loading ? (
                <p className="loading-text">Loading showcase...</p>
            ) : projects.length === 0 ? (
                <div className="showcase-empty glass-card">
                    <Trophy size={48} />
                    <h3>No showcased projects yet</h3>
                    <p>Projects move here once they're marked as "Showcase" by their owners.</p>
                    <Link to="/projects" className="btn btn-primary">Browse Active Projects</Link>
                </div>
            ) : (
                <div className="showcase-grid">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            className="showcase-card glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="showcase-card-header">
                                <h3>{project.title}</h3>
                                <span className="showcase-badge">✨ Shipped</span>
                            </div>
                            <p className="showcase-desc">{project.description}</p>
                            {project.skills_needed && (
                                <div className="showcase-skills">
                                    {project.skills_needed.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                                        <SkillTag key={s} skill={s} />
                                    ))}
                                </div>
                            )}
                            <div className="showcase-meta">
                                <Link to={`/profile/${project.owner_id}`} className="showcase-owner">
                                    <img src={project.owner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.owner.name)}&background=7c3aed&color=fff`} alt="" />
                                    {project.owner.name}
                                </Link>
                                <div className="showcase-links">
                                    {project.github_repo_url && (
                                        <a href={project.github_repo_url} target="_blank" rel="noopener noreferrer" className="showcase-link">
                                            <Github size={16} /> Code
                                        </a>
                                    )}
                                    {project.demo_url && (
                                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="showcase-link showcase-link-primary">
                                            <ExternalLink size={16} /> Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
