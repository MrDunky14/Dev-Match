import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, fetchGitHubProfile } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import SkillTag from '../components/SkillTag';
import './CreateProfile.css';

const POPULAR_SKILLS = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
    'Java', 'Flutter', 'Firebase', 'MongoDB', 'Docker',
    'AWS', 'Figma', 'TensorFlow', 'PostgreSQL', 'CSS',
    'Go', 'Kotlin', 'Solidity', 'C++', 'Rust',
];

const DEPARTMENTS = [
    'Computer Science', 'Information Technology', 'AI & Data Science',
    'EXTC', 'Mechanical', 'Civil', 'Electrical',
];

const AVAILABILITY_OPTIONS = [
    'Looking for team', 'Open to collaborate', 'Busy with project', 'Not available',
];

export default function CreateProfile() {
    const navigate = useNavigate();
    const { setCurrentUser } = useIdentity();
    const [form, setForm] = useState({
        name: '',
        email: '',
        bio: '',
        semester: '',
        department: '',
        github_url: '',
        github_username: '',
        whatsapp_number: '',
        availability: 'Looking for team',
        skills: [],
    });
    const [customSkill, setCustomSkill] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // GitHub import state
    const [ghUsername, setGhUsername] = useState('');
    const [ghLoading, setGhLoading] = useState(false);
    const [ghImported, setGhImported] = useState(false);

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

    const importFromGitHub = async () => {
        if (!ghUsername.trim()) return;
        setGhLoading(true);
        setError('');
        try {
            const { data } = await fetchGitHubProfile(ghUsername.trim());
            setForm((prev) => ({
                ...prev,
                name: data.name || prev.name,
                bio: data.bio || prev.bio,
                avatar_url: data.avatar_url || prev.avatar_url,
                github_url: `https://github.com/${data.username}`,
                github_username: data.username,
                skills: [...new Set([...prev.skills, ...data.detected_skills])],
            }));
            setGhImported(true);
        } catch {
            setError(`GitHub user "${ghUsername}" not found. Check the username and try again.`);
        } finally {
            setGhLoading(false);
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
            const res = await createUser({
                ...form,
                semester: parseInt(form.semester),
                avatar_url: form.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
            });
            setCurrentUser(res.data); // Auto-login
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
                        <p>Welcome to Dev-Match at SLRTCE. Redirecting you to the Discover page…</p>
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
                    <p>Join the SLRTCE developer community — list your skills and find your team</p>
                </div>

                {/* ── GitHub Import Section ── */}
                <div className="github-import glass-card slide-up">
                    <div className="github-import-header">
                        <span className="github-icon">⚡</span>
                        <div>
                            <h3>Quick Start — Import from GitHub</h3>
                            <p>We'll auto-detect your name, bio, and skills from your repos</p>
                        </div>
                    </div>
                    <div className="github-import-row">
                        <input
                            className="form-input"
                            placeholder="GitHub username (e.g. torvalds)"
                            value={ghUsername}
                            onChange={(e) => setGhUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), importFromGitHub())}
                        />
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={importFromGitHub}
                            disabled={ghLoading || !ghUsername.trim()}
                        >
                            {ghLoading ? '🔍 Scanning…' : ghImported ? '✅ Imported!' : '🔍 Import'}
                        </button>
                    </div>
                    {ghImported && (
                        <div className="github-import-success">
                            ✅ Imported! We found <strong>{form.skills.length}</strong> skills from your repos. Review and edit below.
                        </div>
                    )}
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
                                placeholder="you@slrtce.in"
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

                    <div className="form-row">
                        <div className="form-group">
                            <label>WhatsApp Number</label>
                            <input
                                name="whatsapp_number"
                                className="form-input"
                                placeholder="10-digit number (e.g. 9876543210)"
                                value={form.whatsapp_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Availability</label>
                            <select name="availability" className="form-select" value={form.availability} onChange={handleChange}>
                                {AVAILABILITY_OPTIONS.map((a) => (
                                    <option key={a} value={a}>{a}</option>
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
