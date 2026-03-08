import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, User, Link2, Github } from 'lucide-react';
import { createProject } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import { useToast } from '../components/Toast';
import SkillTag from '../components/SkillTag';
import './PostProject.css';

const COMMON_SKILLS = [
    'React', 'Node.js', 'Python', 'Firebase', 'Flutter',
    'MongoDB', 'TypeScript', 'Docker', 'AWS', 'Figma',
    'TensorFlow', 'PostgreSQL', 'Solidity', 'WebSocket',
    'D3.js', 'CSS', 'NLP', 'WebRTC',
];

const COMMON_ROLES = [
    'Frontend Developer', 'Backend Developer', 'Mobile Developer',
    'UI/UX Designer', 'ML Engineer', 'DevOps Engineer',
    'Data Visualization Expert', 'Smart Contract Developer',
    'Full-Stack Developer', 'QA Engineer',
];

export default function PostProject() {
    const navigate = useNavigate();
    const { currentUser } = useIdentity();
    const toast = useToast();
    const [form, setForm] = useState({
        title: '',
        description: '',
        selectedSkills: [],
        selectedRoles: [],
        demo_url: '',
        github_repo_url: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const toggleSkill = (skill) => {
        setForm((prev) => ({
            ...prev,
            selectedSkills: prev.selectedSkills.includes(skill)
                ? prev.selectedSkills.filter((s) => s !== skill)
                : [...prev.selectedSkills, skill],
        }));
    };

    const toggleRole = (role) => {
        setForm((prev) => ({
            ...prev,
            selectedRoles: prev.selectedRoles.includes(role)
                ? prev.selectedRoles.filter((r) => r !== role)
                : [...prev.selectedRoles, role],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!currentUser) {
            setError('Please create a profile first');
            return;
        }
        if (!form.title || !form.description) {
            setError('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await createProject({
                title: form.title,
                description: form.description,
                owner_id: currentUser.id,
                skills_needed: form.selectedSkills.join(', '),
                roles_needed: form.selectedRoles.join(', '),
                demo_url: form.demo_url,
                github_repo_url: form.github_repo_url,
            });
            setSuccess(true);
            toast.success('Project posted successfully!');
            setTimeout(() => navigate('/projects'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <motion.div
                className="page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container">
                    <motion.div
                        className="success-card glass-card"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Rocket size={48} className="success-icon" style={{ color: 'var(--accent-cyan)', marginBottom: 16 }} />
                        <h2>Project Posted!</h2>
                        <p>Your project is live on the Help Wanted board. Redirecting…</p>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="container">
                <div className="page-header">
                    <h1>Post a Project <Rocket size={28} className="title-icon offset-icon" /></h1>
                    <p>Posting as <strong>{currentUser.name}</strong> — describe your idea and find teammates</p>
                </div>

                <motion.form
                    className="project-form glass-card"
                    onSubmit={handleSubmit}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
                >
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                        <label>Project Title *</label>
                        <input
                            name="title"
                            className="form-input"
                            placeholder="e.g. CampusEats — Food Delivery for Hostels"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            className="form-textarea auto-resize"
                            placeholder="Describe your project idea, what you're building, and what stage you're at…"
                            value={form.description}
                            onChange={(e) => { handleChange(e); autoResize(e); }}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label>Skills Needed</label>
                        <div className="selected-skills">
                            {form.selectedSkills.map((skill) => (
                                <SkillTag key={skill} skill={skill} removable onClick={() => toggleSkill(skill)} />
                            ))}
                            {form.selectedSkills.length === 0 && (
                                <span className="skills-placeholder">Select from below</span>
                            )}
                        </div>
                        <div className="popular-skills">
                            {COMMON_SKILLS.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    className={`skill-picker-btn ${form.selectedSkills.includes(skill) ? 'selected' : ''}`}
                                    onClick={() => toggleSkill(skill)}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Roles Needed</label>
                        <div className="roles-picker">
                            {COMMON_ROLES.map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    className={`role-picker-btn ${form.selectedRoles.includes(role) ? 'selected' : ''}`}
                                    onClick={() => toggleRole(role)}
                                >
                                    <User size={14} className="badge-icon-left" /> {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><Github size={16} className="badge-icon-left" /> GitHub Repo URL</label>
                            <input
                                name="github_repo_url"
                                className="form-input"
                                placeholder="https://github.com/you/project"
                                value={form.github_repo_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label><Link2 size={16} className="badge-icon-left" /> Live Demo URL</label>
                            <input
                                name="demo_url"
                                className="form-input"
                                placeholder="https://your-project.vercel.app"
                                value={form.demo_url}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={submitting}>
                        {submitting ? 'Posting…' : <><Rocket size={18} /> Post Project</>}
                    </button>
                </motion.form>
            </div>
        </motion.div>
    );
}
