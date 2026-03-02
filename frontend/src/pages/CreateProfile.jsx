import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api';
import SkillTag from '../components/SkillTag';
import './CreateProfile.css';

const POPULAR_SKILLS = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
    'Java', 'Flutter', 'Firebase', 'MongoDB', 'Docker',
    'AWS', 'Figma', 'TensorFlow', 'PostgreSQL', 'CSS',
    'Go', 'Kotlin', 'Solidity', 'C++', 'Rust',
];

const DEPARTMENTS = [
    'Computer Science', 'Information Technology', 'Data Science',
    'Design', 'Electronics', 'Mechanical',
];

export default function CreateProfile() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        bio: '',
        semester: '',
        department: '',
        github_url: '',
        skills: [],
    });
    const [customSkill, setCustomSkill] = useState('');
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
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s) => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    const addCustomSkill = () => {
        const skill = customSkill.trim();
        if (skill && !form.skills.includes(skill)) {
            setForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
            setCustomSkill('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.email || !form.semester || !form.department) {
            setError('Please fill in all required fields');
            return;
        }
        if (form.skills.length === 0) {
            setError('Please select at least one skill');
            return;
        }

        setSubmitting(true);
        try {
            await createUser({
                ...form,
                semester: parseInt(form.semester),
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
            });
            setSuccess(true);
            setTimeout(() => navigate('/discover'), 2000);
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
                        <span className="success-icon">🎉</span>
                        <h2>Profile Created!</h2>
                        <p>Welcome to Dev-Match. Redirecting you to the Discover page…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Create Your Profile</h1>
                    <p>List your skills and let the campus know what you bring to the table</p>
                </div>

                <form className="profile-form glass-card slide-up" onSubmit={handleSubmit}>
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                name="name"
                                className="form-input"
                                placeholder="e.g. Arjun Mehta"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                name="email"
                                type="email"
                                className="form-input"
                                placeholder="you@campus.edu"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Semester *</label>
                            <select name="semester" className="form-select" value={form.semester} onChange={handleChange}>
                                <option value="">Select semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Department *</label>
                            <select name="department" className="form-select" value={form.department} onChange={handleChange}>
                                <option value="">Select department</option>
                                {DEPARTMENTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            className="form-textarea auto-resize"
                            placeholder="Tell us about yourself, what you're passionate about…"
                            value={form.bio}
                            onChange={(e) => { handleChange(e); autoResize(e); }}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>GitHub URL</label>
                        <input
                            name="github_url"
                            className="form-input"
                            placeholder="https://github.com/yourusername"
                            value={form.github_url}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Skills *</label>
                        <div className="selected-skills">
                            {form.skills.map((skill) => (
                                <SkillTag key={skill} skill={skill} removable onClick={() => toggleSkill(skill)} />
                            ))}
                            {form.skills.length === 0 && (
                                <span className="skills-placeholder">Click skills below or add your own</span>
                            )}
                        </div>

                        <div className="popular-skills">
                            {POPULAR_SKILLS.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    className={`skill-picker-btn ${form.skills.includes(skill) ? 'selected' : ''}`}
                                    onClick={() => toggleSkill(skill)}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>

                        <div className="custom-skill-row">
                            <input
                                className="form-input"
                                placeholder="Add a custom skill…"
                                value={customSkill}
                                onChange={(e) => setCustomSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                            />
                            <button type="button" className="btn btn-secondary" onClick={addCustomSkill}>Add</button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={submitting}>
                        {submitting ? 'Creating…' : 'Create Profile ✨'}
                    </button>
                </form>
            </div>
        </div>
    );
}
