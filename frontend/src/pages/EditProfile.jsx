import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../api';
import { useIdentity } from '../hooks/useIdentity';
import SkillTag from '../components/SkillTag';
import { useToast } from '../components/Toast';
import { BadgeCheck, Github } from 'lucide-react';
import './EditProfile.css';

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

export default function EditProfile() {
    const navigate = useNavigate();
    const { currentUser, refreshUser } = useIdentity();
    const toast = useToast();
    const [form, setForm] = useState({
        name: '',
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
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setForm({
                name: currentUser.name || '',
                bio: currentUser.bio || '',
                semester: currentUser.semester?.toString() || '',
                department: currentUser.department || '',
                github_url: currentUser.github_url || '',
                github_username: currentUser.github_username || '',
                whatsapp_number: currentUser.whatsapp_number || '',
                availability: currentUser.availability || 'Looking for team',
                skills: currentUser.skills?.map(s => s.skill_name) || [],
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const toggleSkill = (skill) => {
        setForm(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill],
        }));
    };

    const addCustomSkill = () => {
        const skill = customSkill.trim();
        if (skill && !form.skills.includes(skill)) {
            setForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
            setCustomSkill('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        setSaving(true);
        try {
            await updateUser(currentUser.id, {
                ...form,
                semester: parseInt(form.semester),
            });
            await refreshUser();
            toast.success('Profile updated!');
            navigate(`/profile/${currentUser.id}`);
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Compute profile completion
    const completionFields = [
        form.name, form.bio, form.github_url, form.github_username,
        form.whatsapp_number, form.skills.length > 0,
    ];
    const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Edit Your Profile</h1>
                    <p>Keep your profile up to date to attract the right teammates</p>
                </div>

                {/* Profile Completion Bar */}
                <div className="completion-card glass-card slide-up">
                    <div className="completion-header">
                        <span>Profile Completion</span>
                        <span className="completion-pct">{completion}%</span>
                    </div>
                    <div className="completion-bar">
                        <div className="completion-fill" style={{ width: `${completion}%` }} />
                    </div>
                    {completion < 100 && (
                        <p className="completion-hint">
                            {!form.bio ? 'Add a bio' : !form.github_url ? 'Link your GitHub' : !form.whatsapp_number ? 'Add WhatsApp number' : 'Almost there!'}
                            {' '}to complete your profile.
                        </p>
                    )}
                </div>

                <form className="profile-form glass-card slide-up" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                name="name"
                                className="form-input"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input className="form-input" value={currentUser?.email || ''} disabled />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Semester</label>
                            <select name="semester" className="form-select" value={form.semester} onChange={handleChange}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <select name="department" className="form-select" value={form.department} onChange={handleChange}>
                                {DEPARTMENTS.map(d => (
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
                                placeholder="10-digit number"
                                value={form.whatsapp_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Availability</label>
                            <select name="availability" className="form-select" value={form.availability} onChange={handleChange}>
                                {AVAILABILITY_OPTIONS.map(a => (
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
                            placeholder="Tell us about yourself…"
                            value={form.bio}
                            onChange={(e) => { handleChange(e); autoResize(e); }}
                            rows={3}
                        />
                    </div>

                    <div className="form-group github-connect-section">
                        <label>Developer Identity</label>
                        {currentUser?.is_verified ? (
                            <div className="verified-status bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center gap-3">
                                <BadgeCheck className="w-6 h-6 text-blue-500" />
                                <div>
                                    <div className="font-medium text-white flex items-center gap-2">
                                        Verified Student
                                        <a href={currentUser.github_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                            ({currentUser.github_username})
                                        </a>
                                    </div>
                                    <div className="text-sm text-zinc-400">Your GitHub account is linked.</div>
                                </div>
                            </div>
                        ) : (
                            <div className="unverified-status bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                                <p className="text-zinc-400 mb-4 text-sm">
                                    Link your GitHub account to verify your student status and get a verified badge on your profile.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
                                        const redirectUri = `${window.location.origin}/github/callback`;
                                        const scope = 'user:email';
                                        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
                                    }}
                                    className="github-verify-btn"
                                >
                                    <Github className="w-5 h-5" />
                                    Verify with GitHub
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Your Skills</label>
                        <div className="selected-skills">
                            {form.skills.map(skill => (
                                <SkillTag key={skill} skill={skill} removable onClick={() => toggleSkill(skill)} />
                            ))}
                            {form.skills.length === 0 && (
                                <span className="skills-placeholder">Click skills below or add your own</span>
                            )}
                        </div>
                        <div className="popular-skills">
                            {POPULAR_SKILLS.map(skill => (
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

                    <div className="edit-actions">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                            {saving ? 'Saving…' : 'Save Changes ✨'}
                        </button>
                        <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
