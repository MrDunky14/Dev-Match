import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, getUsers } from '../api';
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
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        owner_id: '',
        selectedSkills: [],
        selectedRoles: [],
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getUsers().then((r) => setUsers(r.data)).catch(() => { });
    }, []);

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

        if (!form.title || !form.description || !form.owner_id) {
            setError('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await createProject({
                title: form.title,
                description: form.description,
                owner_id: parseInt(form.owner_id),
                skills_needed: form.selectedSkills.join(', '),
                roles_needed: form.selectedRoles.join(', '),
            });
            setSuccess(true);
            setTimeout(() => navigate('/projects'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="page">
                <div className="container">
                    <div className="success-card glass-card slide-up">
                        <span className="success-icon">🚀</span>
                        <h2>Project Posted!</h2>
                        <p>Your project is live on the Help Wanted board. Redirecting…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Post a Project</h1>
                    <p>Describe your idea and find the teammates you need</p>
                </div>

                <form className="project-form glass-card slide-up" onSubmit={handleSubmit}>
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
                        <label>Your Name *</label>
                        <select name="owner_id" className="form-select" value={form.owner_id} onChange={handleChange}>
                            <option value="">Select yourself</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
                            ))}
                        </select>
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
                                    👤 {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={submitting}>
                        {submitting ? 'Posting…' : 'Post Project 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}
